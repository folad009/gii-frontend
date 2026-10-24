import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Card, DemoNote, Label, Pill } from "@/components/bits";
import { formatDuration, durationInDays, programmes } from "@/data/gii";

export const Route = createFileRoute("/programmes/$slug")({
  loader: ({ params }) => {
    const programme = programmes.find((p) => p.slug === params.slug);
    if (!programme) throw notFound();
    return { programme };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Programme unavailable — GII Learning" }, { name: "robots", content: "noindex" }] };
    }
    const { programme } = loaderData;
    return {
      meta: [
        { title: `${programme.title} — GII Learning` },
        { name: "description", content: programme.description },
        { property: "og:title", content: `${programme.title} — Global Impact Institute` },
        { property: "og:description", content: programme.description },
      ],
    };
  },
  component: ProgrammeDetail,
});

function ProgrammeDetail() {
  const { programme } = Route.useLoaderData();
  const [enrolled, setEnrolled] = useState(programme.state === "current" || programme.state === "completed");
  const blocked = programme.prerequisites.filter((p) => !p.met);
  const recommendedDays = durationInDays(programme.duration);
  const [planUnit, setPlanUnit] = useState<"days" | "weeks" | "months">("weeks");
  const [planValue, setPlanValue] = useState(Math.max(1, Math.round(recommendedDays / 7)));
  const totalLessons = programme.modules.reduce((sum, m) => sum + m.lessons, 0);
  const planDays = planValue * (planUnit === "days" ? 1 : planUnit === "weeks" ? 7 : 30);
  const lessonsPerWeek = Math.max(1, Math.round((totalLessons / planDays) * 7));


  return (
    <div className="space-y-8">
      <div>
        <Link to="/explore" className="font-mono text-[10px] uppercase tracking-[0.2em] text-magenta">
          ← Explore programmes
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Pill tone="navy">{programme.pathway}</Pill>
          <Pill tone="teal">{programme.mode}</Pill>
          <Pill>{programme.duration}</Pill>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{programme.title}</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">{programme.description}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card className="p-5">
            <Label>Learning outcomes</Label>
            <ul className="mt-3 space-y-2 text-[13px]">
              {programme.outcomes.map((o) => (
                <li key={o} className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-magenta" />
                  {o}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <Label>Modules</Label>
            <ol className="mt-3 divide-y divide-line">
              {programme.modules.map((m, i) => (
                <li key={m.title} className="flex items-center gap-3 py-3">
                  <span className="grid size-7 place-items-center rounded-full bg-muted font-mono text-[11px]">
                    {i + 1}
                  </span>
                  <span className="text-[13px] font-medium">{m.title}</span>
                  <span className="ml-auto font-mono text-[11px] text-ink-soft">{m.lessons} lessons</span>
                </li>
              ))}
            </ol>
          </Card>

          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label>Group case studies</Label>
              <Pill tone="lime">Small-group discussion</Pill>
            </div>
            <div className="mt-4 space-y-5">
              {programme.caseStudies.map((caseStudy) => (
                <section key={caseStudy.title}>
                  <h2 className="font-display text-lg font-semibold">{caseStudy.title}</h2>
                  <p className="mt-2 text-[13px] leading-6 text-ink-soft">{caseStudy.scenario}</p>
                  <div className="mt-4">
                    <Label>Discuss together</Label>
                  </div>
                  <ol className="mt-2 space-y-2 text-[13px]">
                    {caseStudy.discussion.map((question, index) => (
                      <li key={question} className="flex gap-3">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted font-mono text-[10px]">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{question}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
            <p className="mt-5 border-t border-line pt-3 text-[11px] text-ink-soft">
              Prototype case-study material for facilitated group learning.
            </p>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="p-5">
              <Label>Assessment requirements</Label>
              <p className="mt-2 text-[13px]">{programme.assessment}</p>
            </Card>
            <Card className="p-5">
              <Label>Completion requirements</Label>
              <p className="mt-2 text-[13px]">{programme.completion}</p>
            </Card>
          </div>

          <Card className="p-5">
            <Label>Prerequisites</Label>
            {programme.prerequisites.length === 0 ? (
              <p className="mt-2 text-[13px]">None — this programme is open to all members.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-[13px]">
                {programme.prerequisites.map((p) => (
                  <li key={p.title} className="flex items-center gap-2">
                    <Pill tone={p.met ? "teal" : "magenta"}>{p.met ? "Complete" : "Outstanding"}</Pill>
                    {p.title}
                  </li>
                ))}
              </ul>
            )}
            {blocked.length > 0 ? (
              <p className="mt-3 rounded-lg bg-magenta/8 p-3 text-[12px] text-ink-soft">
                To enrol, first complete <span className="font-semibold text-foreground">{blocked[0]?.title}</span>.
                Your campus coordinator can help you find the next available cohort.
              </p>
            ) : null}
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <Label>Programme details</Label>
            <dl className="mt-3 space-y-2 text-[13px]">
              {[
                ["Instructor", programme.instructor],
                ["Duration", programme.duration],
                ["Delivery mode", programme.mode],
                ["Campus", programme.campus],
                ["Start date", programme.startDate],
                ["Certificate", programme.certificate],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-ink-soft">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            {programme.state === "completed" ? (
              <p className="mt-5 rounded-lg bg-teal/12 p-3 text-center text-[13px] font-semibold text-teal">
                Completed · certificate issued
              </p>
            ) : blocked.length > 0 ? (
              <button
                disabled
                className="mt-5 w-full cursor-not-allowed rounded-lg bg-muted py-3 text-[13px] font-semibold text-ink-soft"
              >
                Prerequisite required
              </button>
            ) : enrolled ? (
              <div className="mt-5 space-y-2">
                <p className="rounded-lg bg-lime/25 p-3 text-center text-[13px] font-semibold text-lime-ink">
                  You are enrolled
                </p>
                <Link
                  to="/learn/$courseSlug"
                  params={{ courseSlug: programme.slug }}
                  className="block rounded-lg bg-navy py-3 text-center text-[13px] font-semibold text-primary-foreground"
                >
                  Enter course
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setEnrolled(true)}
                className="mt-5 w-full rounded-lg bg-magenta py-3 text-[13px] font-semibold text-accent-foreground"
              >
                Enrol now
              </button>
            )}
          </Card>

          <Card className="p-5">
            <Label>Your study schedule</Label>
            <p className="mt-2 text-[12px] text-ink-soft">
              Set the length that suits you — in days, weeks or months.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                type="number"
                min={1}
                value={planValue}
                onChange={(e) => setPlanValue(Math.max(1, Number(e.target.value) || 1))}
                className="w-20 rounded-md bg-card px-3 py-2 text-[12px] font-medium ring-1 ring-line outline-none"
              />
              <select
                value={planUnit}
                onChange={(e) => setPlanUnit(e.target.value as typeof planUnit)}
                className="rounded-md bg-card px-3 py-2 text-[12px] font-medium ring-1 ring-line outline-none"
              >
                <option value="days">days</option>
                <option value="weeks">weeks</option>
                <option value="months">months</option>
              </select>
            </div>
            <p className="mt-3 text-[13px]">
              {totalLessons} lessons over {formatDuration(planValue, planUnit)} ·{" "}
              <span className="font-medium">
                about {lessonsPerWeek} lesson{lessonsPerWeek === 1 ? "" : "s"} per week
              </span>
            </p>
            <p className="mt-2 text-[11px] text-ink-soft">
              Recommended pace: {programme.duration}.
            </p>
          </Card>

          <Card className="p-5">
            <Label>Delivery</Label>
            <p className="mt-2 text-[13px] text-ink-soft">
              Blended learning: classes at your campus, plus lessons you can complete online. Audio-only and
              downloadable notes are available for every lesson.
            </p>
          </Card>
        </div>
      </div>

      <DemoNote />
    </div>
  );
}
