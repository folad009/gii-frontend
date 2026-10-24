/* eslint-disable prettier/prettier */
const REFRESH_STORAGE_KEY = "gii.refreshToken";
const USER_STORAGE_KEY = "gii.user";

export type SessionUser = {
  id: string;
  email: string;
  userRole: string;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

let accessToken: string | null = null;
let currentUser: SessionUser | null = null;
let refreshInFlight: Promise<string | null> | null = null;
const sessionListeners = new Set<() => void>();

function notifySession() {
  sessionListeners.forEach((listener) => listener());
}

export function subscribeSession(listener: () => void) {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

export function apiUrl() {
  const configured = import.meta.env["VITE_API_URL"];
  if (!configured) {
    throw new ApiError(0, "VITE_API_URL is not set");
  }
  return configured.replace(/\/$/, "");
}

function readRefreshToken() {
  if (typeof sessionStorage === "undefined") return null;
  return sessionStorage.getItem(REFRESH_STORAGE_KEY);
}

export function hasSession() {
  return Boolean(accessToken || readRefreshToken());
}

function readStoredUser() {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SessionUser;
    if (!parsed.userRole) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function sessionUser() {
  return currentUser ?? readStoredUser();
}

export function setSession(tokens: { accessToken: string; refreshToken: string; user?: SessionUser }) {
  accessToken = tokens.accessToken;
  sessionStorage.setItem(REFRESH_STORAGE_KEY, tokens.refreshToken);
  if (tokens.user) {
    currentUser = tokens.user;
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(tokens.user));
  }
  notifySession();
}

export function clearSession() {
  accessToken = null;
  currentUser = null;
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(REFRESH_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
  }
  notifySession();
}

async function refreshAccessToken() {
  const refreshToken = readRefreshToken();
  if (!refreshToken) return null;
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const response = await fetch(`${apiUrl()}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        clearSession();
        return null;
      }
      const data = (await response.json()) as { accessToken?: string };
      if (!data.accessToken) {
        clearSession();
        return null;
      }
      accessToken = data.accessToken;
      return accessToken;
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function errorMessage(response: Response) {
  const data = (await response.json().catch(() => null)) as { error?: string } | null;
  return data?.error || response.statusText || "Request failed";
}

export async function apiFetch<T>(path: string, init: RequestInit = {}, allowRefresh = true): Promise<T> {
  if (!accessToken && readRefreshToken()) {
    await refreshAccessToken();
  }

  const headers = new Headers(init.headers);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(`${apiUrl()}${path}`, { ...init, headers });
  if (response.status === 401 && allowRefresh) {
    const next = await refreshAccessToken();
    if (next) return apiFetch<T>(path, init, false);
    clearSession();
    throw new ApiError(401, "Session expired");
  }
  if (!response.ok) throw new ApiError(response.status, await errorMessage(response));
  return (await response.json()) as T;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${apiUrl()}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new ApiError(response.status, await errorMessage(response));
  const data = (await response.json()) as {
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; userRole: string };
  };
  setSession(data);
  return data;
}

export async function logout() {
  const refreshToken = readRefreshToken();
  try {
    if (accessToken && refreshToken) {
      await fetch(`${apiUrl()}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } finally {
    clearSession();
  }
}

export type NewUser = {
  fullName: string;
  email: string;
  password: string;
  userRole: "LEARNER" | "INSTRUCTOR" | "GII_ADMINISTRATOR" | "CAMPUS_COORDINATOR" | "GII_LEADERSHIP";
  department:
    | "MEDIA"
    | "PRAISE_GANG"
    | "TECH_TEAM"
    | "MINISTRY_TEAM"
    | "WELFARE_TEAM"
    | "OUTREACH_TEAM"
    | "ADMINISTRATION";
};

export function createUser(user: NewUser) {
  return apiFetch<{ id: string; email: string; fullName: string; userRole: string }>("/api/v1/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export function createCourseDraft(course: { title: string; description: string }) {
  return apiFetch<{ id: string; title: string; description: string | null }>("/api/v1/courses/draft", {
    method: "POST",
    body: JSON.stringify({ title: course.title, description: course.description }),
  });
}

export function createCourseModule(courseId: string, module: { name: string }) {
  return apiFetch<{ id: string; name: string; courseId: string }>(`/api/v1/courses/${courseId}/modules`, {
    method: "POST",
    body: JSON.stringify({ name: module.name }),
  });
}
