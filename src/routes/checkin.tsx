import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, DemoNote, Label, PageHeader, Pill } from "@/components/bits";
import { cohortLearners } from "@/data/gii";

export const Route = createFileRoute("/checkin")({
  head: () => ({
    meta: [
      { title: "GII Class Check-In" },
      { name: "description", content: "QR, manual and instructor attendance check-in for GII classes." },
      { property: "og:title", content: "GII Class Check-In" },
      { property: "og:description", content: "Confirm attendance for a GII class." },
    ],
  }),
  component: CheckIn,
});

function CheckIn() {
  const [mode, setMode] = useState<"QR" | "Manual" | "Instructor">("QR");
  const [marked, setMarked] = useState<string[]>(["David Adeyemi", "Amaka Nwosu"]);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Attendance" title="GII class check-in." subtitle="Word Foundation · Saturday class" />

      <div className="flex flex-wrap gap-2">
        {(["QR", "Manual", "Instructor"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
              mode === m ? "bg-navy text-primary-foreground" : "text-ink-soft ring-1 ring-line hover:bg-muted"
            }`}
          >
            {m === "QR" ? "QR check-in" : m === "Manual" ? "Manual check-in" : "Instructor attendance"}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="p-6">
          {mode === "QR" ? (
            <div className="text-center">
              <Label tone="magenta">GII class check-in</Label>
              <h2 className="mt-2 text-xl font-semibold">Word Foundation</h2>
              <p className="mt-1 text-[13px] text-ink-soft">
                The Goodland · Sat 12 Sep 2026, 10:00 AM · Sarah Okafor
              </p>
              <div className="mx-auto mt-6 grid size-56 place-items-center rounded-2xl border-2 border-dashed border-line bg-muted">
                <div className="text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">QR placeholder</p>
                  <p className="mt-1 text-[12px] text-ink-soft">Code shown on the class screen</p>
                </div>
              </div>
              <p className="mt-5 font-display text-lg">Scan to confirm attendance.</p>
              <p className="mt-2 text-[12px] text-ink-soft">
                In this prototype no code is generated and no attendance is stored.
              </p>
            </div>
          ) : mode === "Manual" ? (
            <div>
              <Label>Manual check-in</Label>
              <p className="mt-2 text-[13px] text-ink-soft">
                Enter a GIC ID or search by name when a learner cannot scan.
              </p>
              <input
                placeholder="GIC-DEMO-001 or learner name"
                className="mt-4 w-full rounded-lg bg-background p-3 text-[13px] ring-1 ring-line outline-none"
              />
              <button className="mt-3 rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground">
                Confirm attendance
              </button>
            </div>
          ) : (
            <div>
              <Label>Instructor attendance</Label>
              <p className="mt-2 text-[13px] text-ink-soft">Mark the register for today's class.</p>
              <div className="mt-4 divide-y divide-line">
                {cohortLearners.map((l) => {
                  const present = marked.includes(l.name);
                  return (
                    <div key={l.name} className="flex items-center gap-3 py-3">
                      <span className="text-[13px] font-medium">{l.name}</span>
                      <button
                        onClick={() =>
                          setMarked((m) => (present ? m.filter((x) => x !== l.name) : [...m, l.name]))
                        }
                        className={`ml-auto rounded-md px-3 py-1.5 text-[12px] font-semibold ${
                          present ? "bg-teal/15 text-teal" : "ring-1 ring-line"
                        }`}
                      >
                        {present ? "Present" : "Mark present"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <Label>Class details</Label>
            <dl className="mt-3 space-y-2 text-[13px]">
              {[
                ["Course", "Word Foundation"],
                ["Campus", "The Goodland"],
                ["Country", "Nigeria"],
                ["Date", "Sat 12 Sep 2026"],
                ["Instructor", "Sarah Okafor"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-ink-soft">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card className="p-5">
            <Label>Marked present</Label>
            <p className="mt-2 font-display text-3xl font-semibold">{marked.length}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {marked.map((m) => (
                <Pill key={m} tone="teal">
                  {m}
                </Pill>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <DemoNote />
    </div>
  );
}
