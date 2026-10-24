import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, DemoNote, Label, PageHeader, Pill, Progress } from "@/components/bits";
import { assignments, certificates, classes, journey, learner, programmes } from "@/data/gii";
import { requireSession } from "@/lib/sessionGuard";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    requireSession();
  },
  head: () => ({
    meta: [
      { title: "My Growth — GII Learning" },
      {
        name: "description",
        content:
          "Continue your Global Impact Institute learning: current course progress, upcoming classes, assignments and your recommended next step.",
      },
      { property: "og:title", content: "My Growth — GII Learning" },
      {
        property: "og:description",
        content: "Continue growing. One step at a time — your GII learning home.",
      },
    ],
  }),
  component: MyGrowth,
});

function MyGrowth() {
  const current = programmes.find((p) => p.slug === "word-foundation")!;
  const nextStep = programmes.find((p) => p.slug === "kingdom-service")!;
  const upcoming = classes.filter((c) => c.status === "Upcoming");
  const openAssignments = assignments.filter(
    (a) => a.status === "Not Started" || a.status === "In Progress",
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="My Growth"
        title={`Welcome back, ${learner.firstName}.`}
        subtitle="“Continue growing. One step at a time.”"
      />

      {/* Continue learning */}
      <section className="relative overflow-hidden rounded-2xl bg-navy p-6 text-primary-foreground sm:p-8">
        <span className="absolute inset-y-8 left-0 w-1.5 rounded-r bg-magenta" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-lime">Continue learning</p>
          <p className="font-mono text-xs text-primary-foreground/70">
            {current.modules.length} modules · {current.mode}
          </p>
        </div>
        <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">{current.title}</h2>
        <p className="mt-1 text-[13px] text-primary-foreground/75">
          Understanding Your New Life in Christ · Module 2 of {current.modules.length} · {learner.campus}
        </p>
        <div className="mt-5 max-w-lg">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-primary-foreground/75">Course progress</span>
            <span className="font-mono text-lime">{current.progress}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-primary-foreground/15">
            <div className="h-full rounded-full bg-lime" style={{ width: `${current.progress}%` }} />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/explore"
            className="rounded-lg bg-magenta px-4 py-2.5 text-[13px] font-semibold text-accent-foreground"
          >
            Browse courses
          </Link>
          <Link
            to="/programmes/$slug"
            params={{ slug: current.slug }}
            className="rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ring-primary-foreground/25"
          >
            View programme
          </Link>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Upcoming classes */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <Label>Upcoming classes</Label>
              <Link to="/classes" className="text-[12px] font-semibold text-magenta">
                My classes
              </Link>
            </div>
            <div className="mt-3 divide-y divide-line">
              {upcoming.map((c) => (
                <div key={c.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="flex flex-col items-center rounded-xl bg-teal/12 px-3 py-2">
                    <span className="font-mono text-[10px] uppercase text-teal">Sat</span>
                    <span className="font-display text-xl font-semibold leading-none text-teal">10</span>
                    <span className="font-mono text-[10px] text-teal">AM</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold">{c.course}</p>
                    <p className="text-[12px] text-ink-soft">
                      {c.when} · {c.location}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Pill tone={c.mode === "Online" ? "teal" : "navy"}>{c.mode}</Pill>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Assignments */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <Label>My assignments</Label>
              <span className="font-mono text-[11px] text-ink-soft">{openAssignments.length} open</span>
            </div>
            <div className="mt-3 divide-y divide-line">
              {openAssignments.map((a) => (
                <div key={a.title} className="flex flex-wrap items-center gap-3 py-3">
                  <p className="text-[13px] font-medium">{a.title}</p>
                  <span className="ml-auto font-mono text-[11px] text-ink-soft">Due {a.due}</span>
                  <Pill tone={a.status === "In Progress" ? "lime" : "neutral"}>{a.status}</Pill>
                </div>
              ))}
            </div>
            <Link to="/assignments" className="mt-4 inline-block text-[12px] font-semibold text-magenta">
              View all assignments
            </Link>
          </Card>

          {/* Next step */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5">
              <Label>Your next step</Label>
              <Pill tone="teal">Service pathway</Pill>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4 p-5">
              <div>
                <p className="text-[13px] text-ink-soft">
                  You completed <span className="font-medium text-foreground">Welcome to God's Family</span>.
                </p>
                <p className="mt-1 font-display text-xl font-semibold">{nextStep.title}</p>
                <p className="text-[13px] text-ink-soft">
                  {nextStep.duration} · {nextStep.mode} · {nextStep.campus}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/programmes/$slug"
                  params={{ slug: nextStep.slug }}
                  className="rounded-md bg-navy px-3.5 py-2 text-[12px] font-semibold text-primary-foreground"
                >
                  View programme
                </Link>
                <Link
                  to="/explore"
                  className="rounded-md px-3.5 py-2 text-[12px] font-semibold ring-1 ring-line"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          {/* Journey */}
          <Card className="p-5">
            <Label>Your GII learning journey</Label>
            <div className="mt-4">
              {journey.map((step, i) => (
                <div key={step.pathway} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid size-7 place-items-center rounded-full text-[12px] font-semibold ${
                        step.state === "current"
                          ? "bg-magenta text-accent-foreground"
                          : step.state === "available"
                            ? "bg-card text-ink-soft ring-1 ring-line"
                            : "bg-muted text-ink-soft"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {i < journey.length - 1 ? <span className="w-px flex-1 bg-line" /> : null}
                  </div>
                  <div className="pb-5">
                    <p className="text-[13px] font-semibold leading-7">{step.pathway}</p>
                    <p className="text-[11px] text-ink-soft">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="border-t border-line pt-3 text-[11px] leading-relaxed text-ink-soft">
              Learning pathways help you discover appropriate opportunities for continued growth and service.
            </p>
            <Link to="/journey" className="mt-3 inline-block text-[12px] font-semibold text-magenta">
              View full journey
            </Link>
          </Card>

          {/* Certificates */}
          <Card className="p-5">
            <Label>My certificates</Label>
            {certificates.map((c) => (
              <div key={c.id} className="mt-3 flex items-center gap-3 rounded-xl border border-line p-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-lime/25 font-display text-lg text-lime-ink">
                  M
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">{c.programme}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">Issued {c.issued}</p>
                </div>
                <Link to="/certificates" className="ml-auto text-[12px] font-semibold text-magenta">
                  View
                </Link>
              </div>
            ))}
          </Card>

          {/* Results */}
          <Card className="p-5">
            <Label>My results</Label>
            <div className="mt-3 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[12px]">
                  <span>Module 2 Quiz</span>
                  <span className="font-mono text-teal">80%</span>
                </div>
                <div className="mt-1.5">
                  <Progress value={80} tone="teal" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[12px]">
                  <span>Module 1 Quiz</span>
                  <span className="font-mono text-teal">90%</span>
                </div>
                <div className="mt-1.5">
                  <Progress value={90} tone="teal" />
                </div>
              </div>
            </div>
          </Card>

          {/* Resources */}
          <Card className="p-5">
            <Label>GII resources</Label>
            <ul className="mt-3 space-y-2 text-[13px]">
              <li className="flex items-center justify-between">
                Daily Rhythms Workbook <Pill>PDF</Pill>
              </li>
              <li className="flex items-center justify-between">
                Acts 2 Study Notes <Pill>PDF</Pill>
              </li>
              <li className="flex items-center justify-between">
                Recorded class — Module 1 <Pill tone="teal">Audio</Pill>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      <DemoNote />
    </div>
  );
}
