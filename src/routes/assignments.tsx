import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, DemoNote, Label, PageHeader, Pill } from "@/components/bits";
import { assignments } from "@/data/gii";

export const Route = createFileRoute("/assignments")({
  head: () => ({
    meta: [
      { title: "My Assignments — GII Learning" },
      { name: "description", content: "Track GII assignments, due dates, submission status and scores." },
      { property: "og:title", content: "My Assignments — GII Learning" },
      { property: "og:description", content: "Assignments, due dates and results across your GII courses." },
    ],
  }),
  component: Assignments,
});

const tone = (status: string) =>
  status === "Completed" ? "teal" : status === "In Progress" ? "lime" : status === "Awaiting Review" ? "magenta" : "neutral";

function Assignments() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="My assignments" title="Assignments and submissions." />

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-line font-mono text-[10px] uppercase tracking-wide text-ink-soft">
              <th className="p-4">Assignment</th>
              <th className="p-4">Course</th>
              <th className="p-4">Due date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Score</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.title} className="border-b border-line last:border-0">
                <td className="p-4 font-medium">{a.title}</td>
                <td className="p-4 text-ink-soft">{a.course}</td>
                <td className="p-4 text-ink-soft">{a.due}</td>
                <td className="p-4">
                  <Pill tone={tone(a.status) as "teal" | "lime" | "magenta" | "neutral"}>{a.status}</Pill>
                </td>
                <td className="p-4 font-mono">{a.score}</td>
                <td className="p-4">
                  <button className="rounded-md px-3 py-1.5 text-[12px] font-semibold ring-1 ring-line">
                    {a.status === "Completed" ? "View feedback" : "Open"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-5">
        <Label>Submit an assignment</Label>
        <p className="mt-2 text-[13px] text-ink-soft">
          Reflection — New Life in Christ · Word Foundation · due Fri 11 Sep 2026
        </p>
        <textarea
          rows={4}
          placeholder="Write your reflection, or attach a document below…"
          className="mt-3 w-full rounded-lg bg-background p-3 text-[13px] ring-1 ring-line outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ring-line">
            Choose file
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
          {fileName ? <span className="text-[12px] text-ink-soft">{fileName}</span> : null}
          <button className="rounded-lg bg-magenta px-4 py-2.5 text-[13px] font-semibold text-accent-foreground">
            Submit for review
          </button>
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-wide text-ink-soft">
          Prototype only — nothing is uploaded
        </p>
      </Card>

      <DemoNote />
    </div>
  );
}
