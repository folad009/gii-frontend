import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, DemoNote, Label, PageHeader, Progress, Stat } from "@/components/bits";
import { leadership, programmes } from "@/data/gii";
import { countries } from "@/data/org";
import { requireSession } from "@/lib/sessionGuard";

export const Route = createFileRoute("/leadership")({
  beforeLoad: () => {
    requireSession();
  },
  head: () => ({
    meta: [
      { title: "GII Intelligence — Leadership" },
      {
        name: "description",
        content:
          "Leadership view of GII learning: participation, completion, attendance, certificates and the wider GIC people journey.",
      },
      { property: "og:title", content: "GII Intelligence — Leadership" },
      { property: "og:description", content: "Aggregated GII learning participation for GIC leadership." },
    ],
  }),
  component: Leadership,
});

function Leadership() {
  const d = leadership;
  const [country, setCountry] = useState("All countries");
  const [period, setPeriod] = useState("This quarter");
  const max = Math.max(...d.funnel.map((f) => f.people));

  const select = "rounded-md bg-card px-3 py-2 text-[12px] font-medium ring-1 ring-line outline-none";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="GII intelligence"
        title="Learning across the church."
        subtitle="Participation data — never a measure of anyone's faith."
      />

      <div className="flex flex-wrap gap-2">
        <select className={select} value={country} onChange={(e) => setCountry(e.target.value)}>
          <option>All countries</option>
          {countries.map((c) => (
            <option key={c.code}>{c.name}</option>
          ))}
        </select>
        <select className={select} value={period} onChange={(e) => setPeriod(e.target.value)}>
          {["This month", "This quarter", "This year"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select className={select}>
          <option>All programmes</option>
          {programmes.map((p) => (
            <option key={p.slug}>{p.title}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Stat label="Total learners" value={d.totalLearners.toLocaleString()} />
        <Stat label="Active learners" value={d.activeLearners.toLocaleString()} />
        <Stat label="Programmes running" value={String(d.programmesRunning)} note={`${d.coursesRunning} courses`} />
        <Stat label="Completion rate" value={`${d.completionRate}%`} />
        <Stat label="Attendance" value={`${d.attendance}%`} />
        <Stat label="Assessment completion" value={`${d.assessmentCompletion}%`} />
        <Stat label="Certificates issued" value={String(d.certificatesIssued)} />
        <Stat label="Learners awaiting next step" value={String(d.awaitingNextStep)} />
        <Stat label="Countries" value={String(countries.length)} note="Multi-country reporting" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <Label>Completion by campus</Label>
          <div className="mt-4 space-y-4">
            {d.byCampus.map((c) => (
              <div key={c.campus}>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium">{c.campus}</span>
                  <span className="font-mono text-[12px] text-ink-soft">
                    {c.learners} learners · {c.completion}%
                  </span>
                </div>
                <div className="mt-1.5">
                  <Progress value={c.completion} tone="teal" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <Label>Learners by country</Label>
          <div className="mt-4 space-y-4">
            {countries.map((c) => {
              const total = c.campuses.reduce((s, x) => s + x.learners, 0);
              return (
                <div key={c.code}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium">{c.name}</span>
                    <span className="font-mono text-[12px] text-ink-soft">{total} learners</span>
                  </div>
                  <div className="mt-1.5">
                    <Progress value={(total / 700) * 100} tone="magenta" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <Label>People journey — participation view</Label>
        <p className="mt-2 text-[13px] text-ink-soft">
          Discover → Experience → Connect → Grow → Serve → Lead → Impact. GII learning primarily enables GROW while
          opening pathways into service and leadership.
        </p>
        <div className="mt-5 space-y-3">
          {d.funnel.map((f) => (
            <div key={f.stage} className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-[13px] font-medium">{f.stage}</span>
              <div className="h-6 flex-1 overflow-hidden rounded-md bg-muted">
                <div
                  className="h-full rounded-md bg-navy"
                  style={{ width: `${Math.max((f.people / max) * 100, 4)}%` }}
                />
              </div>
              <span className="w-16 shrink-0 text-right font-mono text-[12px] text-ink-soft">{f.people}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-lg bg-muted p-3 text-[12px] text-ink-soft">
          Participation data is not spiritual measurement. It helps leadership steward teaching, classes and follow-up
          — never to rank people.
        </p>
      </Card>

      <DemoNote />
    </div>
  );
}
