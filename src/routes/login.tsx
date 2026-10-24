import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ApiError, hasSession, login, sessionUser } from "@/lib/api";
import { homeFor } from "@/lib/roles";

export const Route = createFileRoute("/login")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window !== "undefined" && hasSession()) {
      throw redirect({ to: homeFor(sessionUser()?.userRole) });
    }
  },
  head: () => ({
    meta: [
      { title: "Sign in — GII Learning" },
      { name: "description", content: "Sign in to Global Impact Institute learning." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const session = await login(email.trim(), password);
      await navigate({ to: homeFor(session.user.userRole) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-card p-8 ring-1 ring-line">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-magenta">GII Learning</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy">Sign in</h1>
        <p className="mt-2 text-[13px] text-ink-soft">Use the email and password for your account.</p>
        <label className="mt-6 block text-[12px] font-semibold">
          Email
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full rounded-lg bg-background px-3 py-2.5 text-[14px] ring-1 ring-line outline-none"
          />
        </label>
        <label className="mt-4 block text-[12px] font-semibold">
          Password
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 w-full rounded-lg bg-background px-3 py-2.5 text-[14px] ring-1 ring-line outline-none"
          />
        </label>
        {error ? <p className="mt-4 text-[13px] text-magenta">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
