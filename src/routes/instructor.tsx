import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, DemoNote, Label, PageHeader, Pill, Progress, Stat } from "@/components/bits";
import { cohortLearners, instructorDashboard } from "@/data/gii";
import { requireSession } from "@/lib/sessionGuard";

export const Route = createFileRoute("/instructor")({
  beforeLoad: () => {
    requireSession();
  },
  head: () => ({
    meta: [
      { title: "Instructor Workspace — GII Learning" },
      {
        name: "description",
        content: "Instructor view of GII cohorts, learner progress, attendance and assignments awaiting review.",
      },
      { property: "og:title", content: "Instructor Workspace — GII Learning" },
      { property: "og:description", content: "Cohorts, learners, attendance and reviews for GII instructors." },
    ],
  }),
  component: Instructor,
});

const statusTone = (s: string) =>
  s === "On Track" ? "teal" : s === "Learning Follow-Up" ? "magenta" : s === "Attendance Follow-Up" ? "lime" : "neutral";

function Instructor() {
  const d = instructorDashboard;
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Instructor workspace"
        title={d.course}
        subtitle={d.cohort}
        action={
          <Link
            to="/checkin"
            className="rounded-lg bg-magenta px-4 py-2.5 text-[13px] font-semibold text-accent-foreground"
          >
            Take attendance
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Learners" value={String(d.learners)} />
        <Stat label="Active" value={String(d.active)} />
        <Stat label="On track" value={String(d.onTrack)} />
        <Stat label="Need learning follow-up" value={String(d.followUp)} />
        <Stat label="Awaiting review" value={String(d.awaitingReview)} note={`${d.questions} open questions`} />
      </div>

      <Card className="overflow-x-auto">
        <div className="flex items-center justify-between p-4">
          <Label>Learners</Label>
          <Link to="/cohorts" className="text-[12px] font-semibold text-magenta">
            All cohorts
          </Link>
        </div>
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-y border-line font-mono text-[10px] uppercase tracking-wide text-ink-soft">
              <th className="p-4">Learner</th>
              <th className="p-4">Progress</th>
              <th className="p-4">Attendance</th>
              <th className="p-4">Status</th>
              <th className="p-4">Outstanding</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {cohortLearners.map((l) => (
              <tr key={l.name} className="border-b border-line last:border-0">
                <td className="p-4 font-medium">{l.name}</td>
                <td className="p-4">
                  <div className="w-28">
                    <Progress value={l.progress} tone="teal" />
                  </div>
                  <span className="font-mono text-[11px] text-ink-soft">{l.progress}%</span>
                </td>
                <td className="p-4 font-mono text-[12px]">{l.attendance}</td>
                <td className="p-4">
                  <Pill tone={statusTone(l.status) as "teal" | "magenta" | "lime" | "neutral"}>{l.status}</Pill>
                </td>
                <td className="p-4 text-ink-soft">{l.outstanding}</td>
                <td className="p-4">
                  <Link
                    to="/learners/$learnerId"
                    params={{ learnerId: "gic-demo-001" }}
                    className="rounded-md px-3 py-1.5 text-[12px] font-semibold ring-1 ring-line"
                  >
                    Record
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <Label>Assignments to review</Label>
          <div className="mt-3 divide-y divide-line text-[13px]">
            {[
              ["Reflection — New Life in Christ", "Amaka Nwosu", "Submitted 09 Sep"],
              ["Reflection — New Life in Christ", "Blessing Etim", "Submitted 09 Sep"],
              ["Module 2 Quiz (short answer)", "Tobi Ajayi", "Submitted 08 Sep"],
            ].map(([title, who, when]) => (
              <div key={`${who}-${title}`} className="flex flex-wrap items-center gap-3 py-3">
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-[12px] text-ink-soft">
                    {who} · {when}
                  </p>
                </div>
                <button className="ml-auto rounded-md bg-navy px-3 py-1.5 text-[12px] font-semibold text-primary-foreground">
                  Review
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <Label>Announcements</Label>
          <div className="mt-3 rounded-xl border border-line p-3 text-[13px]">
            <p className="font-medium">Welcome to Word Foundation</p>
            <p className="mt-1 text-ink-soft">“Please review Module 1 before Saturday.”</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft">Posted 05 Sep 2026</p>
          </div>
          <textarea
            rows={3}
            placeholder="Write a new announcement for this cohort…"
            className="mt-3 w-full rounded-lg bg-background p-3 text-[13px] ring-1 ring-line outline-none"
          />
          <button className="mt-3 rounded-lg bg-magenta px-4 py-2.5 text-[13px] font-semibold text-accent-foreground">
            Send announcement
          </button>
        </Card>
      </div>

      <DemoNote />
    </div>
  );
}
