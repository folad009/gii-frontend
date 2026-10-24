import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, DemoNote, Label, PageHeader, Pill } from "@/components/bits";
import { classes } from "@/data/gii";
import { flagFor } from "@/data/org";

export const Route = createFileRoute("/classes")({
  head: () => ({
    meta: [
      { title: "My Classes — GII Learning" },
      {
        name: "description",
        content: "Upcoming and past GII classes with locations, joining links, instructors and attendance.",
      },
      { property: "og:title", content: "My Classes — GII Learning" },
      { property: "og:description", content: "Upcoming and past GII classes, materials and attendance." },
    ],
  }),
  component: Classes,
});

function Classes() {
  const upcoming = classes.filter((c) => c.status === "Upcoming");
  const past = classes.filter((c) => c.status === "Past");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="My classes"
        title="Classes and attendance."
        subtitle="Blended learning — at your campus and online."
        action={
          <Link
            to="/checkin"
            className="rounded-lg bg-magenta px-4 py-2.5 text-[13px] font-semibold text-accent-foreground"
          >
            Class check-in
          </Link>
        }
      />

      <section className="space-y-3">
        <Label>Upcoming</Label>
        {upcoming.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="flex flex-wrap items-start gap-4">
              <div>
                <p className="font-display text-lg font-semibold">{c.course}</p>
                <p className="mt-1 text-[13px] text-ink-soft">{c.when}</p>
                <p className="text-[13px] text-ink-soft">
                  {c.location} · {c.instructor}
                </p>
                {c.joiningFrom.length > 0 ? (
                  <div className="mt-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                      Joining from {c.joiningFrom.length} countries ·{" "}
                      {c.joiningFrom.reduce((s, x) => s + x.learners, 0)} learners
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.joiningFrom.map((j) => (
                        <span
                          key={j.country}
                          title={`${j.country} — ${j.learners} learners`}
                          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] ring-1 ring-line"
                        >
                          <span aria-hidden>{flagFor(j.country)}</span>
                          {j.country}
                          <span className="font-mono text-[11px] text-ink-soft">{j.learners}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-[12px] text-ink-soft">
                    <span aria-hidden>{flagFor(c.country)}</span> {c.country}
                  </p>
                )}
              </div>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <Pill tone={c.mode === "Online" ? "teal" : "navy"}>{c.mode}</Pill>
                <button className="rounded-md px-3 py-2 text-[12px] font-semibold ring-1 ring-line">
                  Add to calendar
                </button>
                <button className="rounded-md px-3 py-2 text-[12px] font-semibold ring-1 ring-line">
                  View materials
                </button>
                <button className="rounded-md bg-navy px-3 py-2 text-[12px] font-semibold text-primary-foreground">
                  {c.mode === "Online" ? "Join class" : "Directions"}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <Label>Past classes</Label>
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-line font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                <th className="p-4">Class</th>
                <th className="p-4">When</th>
                <th className="p-4">Location</th>
                <th className="p-4">Country</th>
                <th className="p-4">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {past.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="p-4 font-medium">{c.course}</td>
                  <td className="p-4 text-ink-soft">{c.when}</td>
                  <td className="p-4 text-ink-soft">{c.location}</td>
                  <td className="p-4 text-ink-soft">
                    <span aria-hidden>{flagFor(c.country)}</span> {c.country}
                  </td>
                  <td className="p-4">
                    <Pill tone="teal">{c.attendance}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <DemoNote />
    </div>
  );
}
