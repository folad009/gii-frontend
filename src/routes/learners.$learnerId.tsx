import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Card, DemoNote, Label, PageHeader, Pill, Progress } from "@/components/bits";
import { learnerTimeline } from "@/data/gii";
import { learnerRecords } from "@/data/org";

export const Route = createFileRoute("/learners/$learnerId")({
  loader: ({ params }) => {
    const record = learnerRecords.find((r) => r.gicId.toLowerCase() === params.learnerId.toLowerCase());
    if (!record) throw notFound();
    return { record };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Learner record unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const { record } = loaderData;
    return {
      meta: [
        { title: `${record.name} — Learner Record` },
        {
          name: "description",
          content: `Learning record for ${record.name}: programmes, progress, attendance and certificates.`,
        },
        { name: "robots", content: "noindex" },
        { property: "og:title", content: "Learner Record — GII Learning" },
        { property: "og:description", content: "One person, one GIC identity, one learning record." },
      ],
    };
  },
  component: Learner360,
});

function Learner360() {
  const { record } = Route.useLoaderData();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Learner record"
        title={record.name}
        subtitle={`${record.gicId} · ${record.campus}, ${record.country}`}
        action={
          <Link to="/records" className="rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ring-line">
            All records
          </Link>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card className="p-5">
            <Label>Learning</Label>
            <div className="mt-3 space-y-4">
              <div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium">{record.programme}</span>
                  <span className="font-mono text-[12px]">{record.progress}%</span>
                </div>
                <div className="mt-1.5">
                  <Progress value={record.progress} tone="magenta" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium">Welcome to God's Family</span>
                  <span className="font-mono text-[12px] text-teal">Completed</span>
                </div>
                <div className="mt-1.5">
                  <Progress value={100} tone="teal" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <Label>Record timeline</Label>
            <div className="mt-4">
              {learnerTimeline.map((t, i) => (
                <div key={t.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid size-7 place-items-center rounded-full text-[11px] font-semibold ${
                        t.done ? "bg-teal text-primary-foreground" : "bg-muted text-ink-soft"
                      }`}
                    >
                      {t.done ? "✓" : i + 1}
                    </span>
                    {i < learnerTimeline.length - 1 ? <span className="w-px flex-1 bg-line" /> : null}
                  </div>
                  <div className="pb-5">
                    <p className="text-[13px] font-semibold leading-7">{t.label}</p>
                    <p className="text-[11px] text-ink-soft">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="border-t border-line pt-3 text-[11px] text-ink-soft">
              A prototype of the future connection with GIC OS — one identity across the whole people journey.
            </p>
          </Card>

          <Card className="p-5">
            <Label>Attendance and results</Label>
            <div className="mt-3 divide-y divide-line text-[13px]">
              {[
                ["05 Sep 2026", "Class attended · The Goodland", "Present"],
                ["30 Aug 2026", "Module 2 Quiz", "80%"],
                ["22 Aug 2026", "Module 1 Quiz", "90%"],
                ["20 Feb 2026", "Belonging Reflection", "Awaiting review"],
              ].map(([date, item, outcome]) => (
                <div key={item} className="flex flex-wrap items-center gap-3 py-3">
                  <span className="font-mono text-[11px] text-ink-soft">{date}</span>
                  <span>{item}</span>
                  <span className="ml-auto font-mono text-[12px] text-ink-soft">{outcome}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <Label>Identity</Label>
            <dl className="mt-3 space-y-2 text-[13px]">
              {[
                ["GIC ID", record.gicId],
                ["Membership", record.membership],
                ["Country", record.country],
                ["Campus", record.campus],
                ["Attendance", record.attendance],
                ["Certificates", String(record.certificates)],
                ["Last activity", record.lastActivity],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-ink-soft">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-5">
            <Label>Journey status</Label>
            <div className="mt-3 space-y-2 text-[13px]">
              <div className="flex items-center justify-between">
                Membership <Pill tone="teal">Member</Pill>
              </div>
              <div className="flex items-center justify-between">
                GII <Pill tone="magenta">In progress</Pill>
              </div>
              <div className="flex items-center justify-between">
                Service <Pill>Not yet connected</Pill>
              </div>
              <div className="flex items-center justify-between">
                Leadership <Pill>Not started</Pill>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <Label>Small groups</Label>
            <p className="mt-2 text-[13px]">Foundations Cohort Prayer Circle</p>
            <p className="text-[12px] text-ink-soft">Wed · 8:00 PM · Online</p>
            <Link to="/groups" className="mt-3 inline-block text-[12px] font-semibold text-magenta">
              Manage groups
            </Link>
          </Card>

          <Card className="p-5">
            <Label>Recommended next step</Label>
            <p className="mt-2 font-display text-lg font-semibold">Kingdom Service</p>
            <p className="text-[12px] text-ink-soft">Suggested after Word Foundation is complete.</p>
          </Card>
        </div>
      </div>

      <DemoNote>
        Fictional demo record. Pastoral and confidential information is intentionally not shown in learning records.
      </DemoNote>
    </div>
  );
}
