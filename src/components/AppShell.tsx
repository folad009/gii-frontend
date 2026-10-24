/* eslint-disable prettier/prettier */
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useLayoutEffect, useState, type ReactNode } from "react";
import gicLogo from "@/assets/gic-logo.png.asset.json";
import { hasSession, logout, sessionUser, subscribeSession, type SessionUser } from "@/lib/api";
import { homeFor, navFor, roleMayOpen, shellRole } from "@/lib/roles";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [user, setUser] = useState<SessionUser | null>(null);
  useLayoutEffect(() => {
    const next = sessionUser();
    setUser(next);
    if (!hasSession()) {
      if (pathname !== "/login") void navigate({ to: "/login", replace: true });
    } else if (pathname === "/login") {
      void navigate({ to: homeFor(next?.userRole), replace: true });
    } else if (!roleMayOpen(pathname, shellRole(next?.userRole))) {
      void navigate({ to: homeFor(next?.userRole), replace: true });
    }
    return subscribeSession(() => setUser(sessionUser()));
  }, [pathname, navigate]);
  const role = shellRole(user?.userRole);
  const nav = navFor(role);
  const home = homeFor(user?.userRole);
  if (pathname === "/login") return <>{children}</>;
  if (!user || !roleMayOpen(pathname, role)) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-card px-5 py-7 lg:flex">
          <Link to={home} className="flex items-center gap-2.5">
            <img src={gicLogo.url} alt="Global Impact Church" className="size-10 rounded-md object-contain" />
            <span className="leading-tight">
              <span className="block text-[13px] font-semibold">Global Impact</span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Institute</span>
            </span>
          </Link>

          <nav className="mt-8 space-y-0.5 text-[13px] font-medium text-ink-soft">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-navy text-primary-foreground" }}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-lg border border-line p-3">
              <p className="truncate text-[12px] font-semibold">{user?.email ?? "Signed in"}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
                {role}
              </p>
              <button 
              type="button"
              onClick={() => {
                void logout().then(() => navigate({ to: "/login", replace: true }));
              }}
              className="mt-3 w-full rounded-md px-2 py-1.5 text-left text-[12px] font-semibold text-ink-soft hover:bg-muted"
              >
                Logout
              </button>
            </div>
            <p className="font-display text-[11px] italic text-ink-soft">
              Technology serves ministry. People remain at the centre.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-24 lg:pb-10">
          <div className="brand-rule h-1.5 w-full" />

          <div className="flex items-center justify-between gap-3 border-b border-line bg-card px-5 py-3 lg:hidden">
            <Link to={home} className="flex items-center gap-2">
              <img src={gicLogo.url} alt="Global Impact Church" className="size-8 rounded-md object-contain" />
              <span className="text-sm font-semibold">GII Learning</span>
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">{role}</span>
          </div>

          <div className="flex items-center justify-between gap-3 px-5 pt-6 sm:px-8 lg:px-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              Global Impact Institute · Learning
            </p>
            <p className="rounded-lg bg-card px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft ring-1 ring-line">
              {role}
            </p>
          </div>

          <div className="px-5 py-6 sm:px-8 lg:px-12 lg:py-8">{children}</div>

          <footer className="border-t border-line px-5 py-6 sm:px-8 lg:px-12">
            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-ink-soft">
              <p className="font-display italic">
                Learning serves discipleship. Data serves stewardship.
              </p>
              <p className="font-mono uppercase tracking-[0.18em]">GII · Global Impact Church</p>
            </div>
          </footer>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-around border-t border-line bg-card/95 px-2 py-2 backdrop-blur lg:hidden">
        {nav.slice(0, 5).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            activeProps={{ className: "text-magenta" }}
            className="flex flex-col items-center gap-1 px-1 text-center text-ink-soft"
          >
            <span className="text-[10px] font-semibold leading-tight">{item.label.split(" ")[0]}</span>
            <span className="size-1.5 rounded-full bg-current opacity-40" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
