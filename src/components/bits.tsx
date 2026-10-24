import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-card ring-1 ring-line ${className}`}>{children}</div>
  );
}

export function Label({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "magenta" | "teal" }) {
  const color =
    tone === "magenta" ? "text-magenta" : tone === "teal" ? "text-teal" : "text-ink-soft";
  return (
    <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${color}`}>{children}</p>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "magenta" | "teal" | "lime" | "navy";
}) {
  const map: Record<string, string> = {
    neutral: "bg-muted text-ink-soft",
    magenta: "bg-magenta/12 text-magenta",
    teal: "bg-teal/15 text-teal",
    lime: "bg-lime/25 text-lime-ink",
    navy: "bg-navy/10 text-navy",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export function Progress({ value, tone = "magenta" }: { value: number; tone?: "magenta" | "teal" | "lime" }) {
  const bar = tone === "teal" ? "bg-teal" : tone === "lime" ? "bg-lime" : "bg-magenta";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
      <div className={`h-full rounded-full ${bar}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <Label tone="magenta">{eyebrow}</Label>
        <h1 className="mt-2 text-3xl font-semibold leading-none tracking-tight sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 font-display text-lg italic text-ink-soft">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <Card className="p-5">
      <Label>{label}</Label>
      <p className="mt-2 font-display text-3xl font-semibold leading-none">{value}</p>
      {note ? <p className="mt-1 text-xs text-ink-soft">{note}</p> : null}
    </Card>
  );
}

export function ButtonLink({
  children,
  variant = "primary",
  onClick,
}: {
  children: ReactNode;
  variant?: "primary" | "accent" | "quiet";
  onClick?: () => void;
}) {
  const map = {
    primary: "bg-navy text-primary-foreground hover:bg-navy-deep",
    accent: "bg-magenta text-accent-foreground hover:opacity-90",
    quiet: "ring-1 ring-line text-ink hover:bg-muted",
  } as const;
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-colors ${map[variant]}`}
    >
      {children}
    </button>
  );
}

export function DemoNote({ children }: { children?: ReactNode }) {
  return (
    <p className="mt-6 text-[11px] text-ink-soft">
      {children ?? "All names, cohorts and records shown are fictional demo data for prototype review."}
    </p>
  );
}
