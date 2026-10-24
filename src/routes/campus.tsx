import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, DemoNote, Label, PageHeader, Pill, Stat } from "@/components/bits";
import { classes, cohorts } from "@/data/gii";
import { countries, learnerRecords, smallGroups } from "@/data/org";
import { requireSession } from "@/lib/sessionGuard";

export const Route = createFileRoute("/campus")({
  beforeLoad: () => {
    requireSession();
  },
  head: () => ({
    meta: [
      { title: "Campus GII Dashboard" },
      {
        name: "description",
        content: "Campus coordinator view: cohorts, learners, classes, attendance, groups and outstanding actions.",
      },
      { property: "og:title", content: "Campus GII Dashboard" },
      { property: "og:description", content: "Coordinate GII learning at your campus." },
    ],
  }),
  component: Campus,
});

function Campus() {
  const allCampuses = countries.flatMap((c) => c.campuses.map((x) => ({ ...x, country: c.name })));
  const [campus, setCampus] = useState(allCampuses[0]!.name);
  const selected = allCampuses.find((c) => c.name === campus)!;
  const records = learnerRecords.filter((r) => r.campus === campus);
  const campusCohorts = cohorts.filter((c) => c.campus === campus);
  const groups = smallGroups.filter((g) => g.campus === campus);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Campus GII dashboard"
        title={campus}
        subtitle={`${selected.city} · ${selected.country}`}
        action={
          <select
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            className="rounded-md bg-card px-3 py-2 text-[12px] font-medium ring-1 ring-line outline-none"
          >
            {allCampuses.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Learners" value={String(selected.learners)} note={`Coordinator: ${selected.coordinator}`} />
        <Stat label="Cohorts running" value={String(campusCohorts.length)} />
        <Stat label="Small groups" value={String(groups.length)} />
        <Stat
          label="Outstanding follow-ups"
          value={String(records.filter((r) => r.status.includes("Follow-Up")).length)}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <Label>Current cohorts</Label>
            <Link to="/cohorts" className="text-[12px] font-semibold text-magenta">
              Manage
            </Link>
          </div>
          <div className="mt-3 divide-y divide-line text-[13px]">
            {campusCohorts.length === 0 ? (
              <p className="py-3 text-ink-soft">No cohorts recorded at this campus yet.</p>
            ) : (
              campusCohorts.map((c) => (
                <div key={c.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div>
                    <p className="font-medium">{c.course}</p>
                    <p className="text-[12px] text-ink-soft">
                      {c.label} · {c.instructor}
                    </p>
                  </div>
                  <span className="ml-auto font-mono text-[12px] text-ink-soft">
                    {c.active}/{c.registered} active
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <Label>Upcoming classes</Label>
            <Link to="/checkin" className="text-[12px] font-semibold text-magenta">
              Attendance
            </Link>
          </div>
          <div className="mt-3 divide-y divide-line text-[13px]">
            {classes
              .filter((c) => c.status === "Upcoming")
              .map((c) => (
                <div key={c.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div>
                    <p className="font-medium">{c.course}</p>
                    <p className="text-[12px] text-ink-soft">{c.when}</p>
                  </div>
                  <span className="ml-auto">
                    <Pill tone={c.mode === "Online" ? "teal" : "navy"}>{c.mode}</Pill>
                  </span>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <Label>Prayer and study groups</Label>
            <Link to="/groups" className="text-[12px] font-semibold text-magenta">
              All groups
            </Link>
          </div>
          <div className="mt-3 divide-y divide-line text-[13px]">
            {groups.length === 0 ? (
              <p className="py-3 text-ink-soft">No groups formed at this campus yet.</p>
            ) : (
              groups.map((g) => (
                <div key={g.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div>
                    <p className="font-medium">{g.name}</p>
                    <p className="text-[12px] text-ink-soft">
                      {g.meets} · {g.leader}
                    </p>
                  </div>
                  <span className="ml-auto font-mono text-[12px] text-ink-soft">
                    {g.members}/{g.capacity}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <Label>Learners needing follow-up</Label>
            <Link to="/records" className="text-[12px] font-semibold text-magenta">
              Records
            </Link>
          </div>
          <div className="mt-3 divide-y divide-line text-[13px]">
            {records
              .filter((r) => r.status.includes("Follow-Up"))
              .map((r) => (
                <div key={r.gicId} className="flex flex-wrap items-center gap-3 py-3">
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-[12px] text-ink-soft">
                      {r.programme} · {r.progress}%
                    </p>
                  </div>
                  <span className="ml-auto">
                    <Pill tone="magenta">{r.status}</Pill>
                  </span>
                </div>
              ))}
            {records.filter((r) => r.status.includes("Follow-Up")).length === 0 ? (
              <p className="py-3 text-ink-soft">No outstanding follow-ups.</p>
            ) : null}
          </div>
        </Card>
      </div>

      <p className="text-[12px] text-ink-soft">
        Coordinators only see learners and records for the campuses they are authorised to support.
      </p>

      <DemoNote />
    </div>
  );
}
