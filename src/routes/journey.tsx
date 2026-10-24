import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, DemoNote, Label, PageHeader, Pill } from "@/components/bits";
import { pathwayOrder, programmes } from "@/data/gii";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Your GII Learning Journey" },
      {
        name: "description",
        content:
          "See the Foundation, Growth, Service and Leadership pathways and which learning opportunities are open to you.",
      },
      { property: "og:title", content: "Your GII Learning Journey" },
      {
        property: "og:description",
        content: "Learning pathways that help you discover opportunities for growth and service.",
      },
    ],
  }),
  component: Journey,
});

const stageState: Record<string, "completed" | "current" | "available" | "locked"> = {
  Foundation: "current",
  Growth: "available",
  Service: "available",
  Leadership: "locked",
};

const stateTone = {
  completed: "teal",
  current: "magenta",
  available: "neutral",
  locked: "neutral",
} as const;

function Journey() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your GII learning journey"
        title="Foundation to impact."
        subtitle="One person · one GIC identity · one learning record"
      />

      <p className="max-w-2xl text-[14px] text-ink-soft">
        Learning pathways help you discover appropriate opportunities for continued growth and service. This is not a
        ranking of people or a measure of anyone's faith — only a map of learning that is open to you.
      </p>

      <div className="space-y-3">
        {pathwayOrder.map((stage, i) => {
          const state = stageState[stage]!;
          const inStage = programmes.filter((p) => p.pathway === stage);
          return (
            <Card
              key={stage}
              className={`p-5 ${state === "current" ? "ring-2 ring-magenta/40" : ""} ${
                state === "locked" ? "opacity-70" : ""
              }`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`grid size-9 place-items-center rounded-full font-display text-base font-semibold ${
                    state === "current"
                      ? "bg-magenta text-accent-foreground"
                      : state === "completed"
                        ? "bg-teal text-primary-foreground"
                        : "bg-muted text-ink-soft"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-display text-xl font-semibold">{stage}</p>
                  <p className="text-[12px] text-ink-soft">{inStage.length} programmes</p>
                </div>
                <div className="ml-auto">
                  <Pill tone={stateTone[state]}>{state === "locked" ? "Locked" : state}</Pill>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {inStage.map((p) => (
                  <Link
                    key={p.slug}
                    to="/programmes/$slug"
                    params={{ slug: p.slug }}
                    className="rounded-full px-3 py-1.5 text-[12px] font-medium ring-1 ring-line hover:bg-muted"
                  >
                    {p.title}
                    {p.state === "completed" ? " ✓" : p.state === "current" ? ` · ${p.progress}%` : ""}
                  </Link>
                ))}
              </div>
            </Card>
          );
        })}

        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-muted font-display text-base font-semibold text-ink-soft">
              5
            </span>
            <div>
              <p className="font-display text-xl font-semibold">Impact</p>
              <p className="text-[12px] text-ink-soft">Serving the wider community through GIC initiatives</p>
            </div>
            <div className="ml-auto">
              <Pill>Ahead</Pill>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <Label>Your next step</Label>
        <p className="mt-2 text-[13px] text-ink-soft">
          You completed <span className="font-medium text-foreground">Welcome to God's Family</span> and are 65% through
          Word Foundation.
        </p>
        <p className="mt-1 font-display text-xl font-semibold">Suggested next: Kingdom Service</p>
        <div className="mt-4 flex gap-2">
          <Link
            to="/programmes/$slug"
            params={{ slug: "kingdom-service" }}
            className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground"
          >
            View programme
          </Link>
          <Link to="/explore" className="rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ring-line">
            Learn more
          </Link>
        </div>
      </Card>

      <DemoNote />
    </div>
  );
}
