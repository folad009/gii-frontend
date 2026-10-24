import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, DemoNote, Label, PageHeader, Pill, Progress } from "@/components/bits";
import { cohortLearners, cohorts } from "@/data/gii";
import { countries } from "@/data/org";

export const Route = createFileRoute("/cohorts")({
  head: () => ({
    meta: [
      { title: "Cohorts — GII Learning" },
      { name: "description", content: "Manage GII cohorts across campuses and countries: learners, attendance and progress." },
      { property: "og:title", content: "Cohorts — GII Learning" },
      { property: "og:description", content: "GII cohort management for coordinators and administrators." },
    ],
  }),
  component: Cohorts,
});

function Cohorts() {
  const [selected, setSelected] = useState(cohorts[0]!.id);
  const [country, setCountry] = useState("All countries");
  const cohort = cohorts.find((c) => c.id === selected)!;

  const campusesFor = (name: string) =>
    countries.find((c) => c.name === name)?.campuses.map((c) => c.name) ?? [];
  const list =
    country === "All countries" ? cohorts : cohorts.filter((c) => campusesFor(country).includes(c.campus));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Cohorts"
        title="Cohort management."
        subtitle="Groups of learners moving through a course together."
        action={
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="rounded-md bg-card px-3 py-2 text-[12px] font-medium ring-1 ring-line outline-none"
          >
            <option>All countries</option>
            {countries.map((c) => (
              <option key={c.code}>{c.name}</option>
            ))}
          </select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((c) => (
          <button key={c.id} onClick={() => setSelected(c.id)} className="text-left">
            <Card
              className={`h-full p-5 transition-all ${
                c.id === selected ? "ring-2 ring-magenta/40" : "hover:-translate-y-0.5"
              }`}
            >
              <Label>{c.campus}</Label>
              <p className="mt-2 font-display text-lg font-semibold leading-snug">{c.course}</p>
              <p className="text-[12px] text-ink-soft">{c.label}</p>
              <p className="mt-3 text-[12px] text-ink-soft">Instructor: {c.instructor}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
                <span>Registered {c.registered}</span>
                <span>Started {c.started}</span>
                <span>Active {c.active}</span>
                <span>Completed {c.completed}</span>
              </div>
            </Card>
          </button>
        ))}
      </div>

      <Card className="overflow-x-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <Label>Cohort register</Label>
            <p className="mt-1 text-[13px] font-semibold">
              {cohort.course} · {cohort.campus} · {cohort.label}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-md px-3 py-2 text-[12px] font-semibold ring-1 ring-line">
              Manage attendance
            </button>
            <button className="rounded-md px-3 py-2 text-[12px] font-semibold ring-1 ring-line">
              Send announcement
            </button>
            <button className="rounded-md bg-navy px-3 py-2 text-[12px] font-semibold text-primary-foreground">
              Export register
            </button>
          </div>
        </div>
        <table className="w-full min-w-[700px] text-left text-[13px]">
          <thead>
            <tr className="border-y border-line font-mono text-[10px] uppercase tracking-wide text-ink-soft">
              <th className="p-4">Learner</th>
              <th className="p-4">Progress</th>
              <th className="p-4">Attendance</th>
              <th className="p-4">Status</th>
              <th className="p-4">Outstanding action</th>
            </tr>
          </thead>
          <tbody>
            {cohortLearners.map((l) => (
              <tr key={l.name} className="border-b border-line last:border-0">
                <td className="p-4 font-medium">
                  <Link to="/learners/$learnerId" params={{ learnerId: "gic-demo-001" }}>
                    {l.name}
                  </Link>
                </td>
                <td className="p-4">
                  <div className="w-28">
                    <Progress value={l.progress} tone="teal" />
                  </div>
                </td>
                <td className="p-4 font-mono text-[12px]">{l.attendance}</td>
                <td className="p-4">
                  <Pill tone={l.status === "On Track" ? "teal" : "magenta"}>{l.status}</Pill>
                </td>
                <td className="p-4 text-ink-soft">{l.outstanding}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <DemoNote />
    </div>
  );
}
