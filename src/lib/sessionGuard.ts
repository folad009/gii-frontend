import { redirect } from "@tanstack/react-router";
import { hasSession, sessionUser } from "@/lib/api";
import { homeFor, roleMayOpen, shellRole } from "@/lib/roles";

export function requireSession() {
  if (typeof window !== "undefined" && !hasSession()) {
    throw redirect({ to: "/login" });
  }
}

export function requireRolePath(pathname: string) {
  requireSession();
  if (typeof window === "undefined") return;
  const user = sessionUser();
  if (!user) return;
  const role = shellRole(user.userRole);
  if (!roleMayOpen(pathname, role)) {
    throw redirect({ to: homeFor(user.userRole) });
  }
}
