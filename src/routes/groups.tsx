import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, DemoNote, Label, PageHeader, Pill, Progress } from "@/components/bits";
import { countries, flagFor, smallGroups, type SmallGroup } from "@/data/org";

export const Route = createFileRoute("/groups")({
  head: () => ({
    meta: [
      { title: "Daily Bible Study & Prayer Groups — GII Learning" },
      {
        name: "description",
        content:
          "Join or start a small group of 2–50 members reading and studying the Bible daily at a time you choose, in person or online, anywhere in the world.",
      },
      { property: "og:title", content: "Daily Bible Study & Prayer Groups — GII Learning" },
      {
        property: "og:description",
        content: "Daily Bible reading and prayer in small groups across GIC campuses and countries.",
      },
    ],
  }),
  component: Groups,
});

function Groups() {
  const [groups, setGroups] = useState<SmallGroup[]>(smallGroups);
  const [country, setCountry] = useState("All countries");
  const [kind, setKind] = useState("All types");
  const [joined, setJoined] = useState<string[]>(["g2"]);
  const [form, setForm] = useState({
    name: "",
    kind: "Daily Bible Study" as SmallGroup["kind"],
    campus: countries[0]!.campuses[0]!.name,
    meets: "",
    dailyTime: "06:00",
    timezone: countries[0]!.timezone,
    plan: "",
    mode: "Online" as "Physical" | "Online",
    location: "",
    capacity: 12,
  });

  const list = groups.filter((g) => {
    if (country !== "All countries" && g.country !== country) return false;
    if (kind !== "All types" && g.kind !== kind) return false;
    return true;
  });

  const campusOptions = countries.flatMap((c) => c.campuses.map((x) => ({ campus: x.name, country: c.name })));
  const select = "rounded-md bg-card px-3 py-2 text-[12px] font-medium ring-1 ring-line outline-none";

  function createGroup() {
    if (!form.name.trim()) return;
    const match = campusOptions.find((c) => c.campus === form.campus)!;
    const daily = form.kind === "Daily Bible Study";
    const capacity = Math.min(50, Math.max(2, Number(form.capacity) || 12));
    setGroups((g) => [
      {
        id: `g${g.length + 1}`,
        name: form.name.trim(),
        kind: form.kind,
        campus: form.campus,
        country: match.country,
        leader: "David Adeyemi",
        meets: daily
          ? `Every day · ${form.dailyTime} ${form.timezone.split(" ")[0]}`
          : form.meets || "To be confirmed",
        mode: form.mode,
        location: form.location || (form.mode === "Online" ? "Online meeting link" : "To be confirmed"),
        members: 1,
        capacity,
        ...(daily
          ? { dailyTime: form.dailyTime, timezone: form.timezone, plan: form.plan || "Reading plan to be chosen" }
          : {}),
      },
      ...g,
    ]);
    setForm({ ...form, name: "", meets: "", location: "", plan: "" });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Small groups"
        title="Daily Bible study, prayer and fellowship."
        subtitle="Read and study the Bible together every day, at a time your group chooses — 2 to 50 members, anywhere in the world."
      />

      <div className="flex flex-wrap gap-2">
        <select className={select} value={country} onChange={(e) => setCountry(e.target.value)}>
          <option>All countries</option>
          {countries.map((c) => (
            <option key={c.code}>{c.name}</option>
          ))}
        </select>
        <select className={select} value={kind} onChange={(e) => setKind(e.target.value)}>
          {["All types", "Daily Bible Study", "Prayer Meeting", "Study Group", "Class Group"].map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((g) => {
          const isJoined = joined.includes(g.id);
          const full = g.members >= g.capacity;
          return (
            <Card key={g.id} className="flex h-full flex-col p-5">
              <div className="flex items-center justify-between">
                <Pill tone={g.kind === "Daily Bible Study" ? "lime" : g.kind === "Prayer Meeting" ? "magenta" : "teal"}>
                  {g.kind}
                </Pill>
                <Pill tone={g.mode === "Online" ? "teal" : "navy"}>{g.mode}</Pill>
              </div>
              <p className="mt-4 font-display text-lg font-semibold leading-snug">{g.name}</p>
              <p className="mt-1 text-[12px] text-ink-soft">
                <span aria-hidden>{flagFor(g.country)}</span> {g.campus} · {g.country}
              </p>
              <p className="mt-3 text-[13px]">{g.meets}</p>
              {g.timezone ? <p className="text-[12px] text-ink-soft">{g.timezone}</p> : null}
              <p className="text-[12px] text-ink-soft">{g.location}</p>
              {g.plan ? <p className="mt-2 text-[12px] font-medium text-teal">Reading plan: {g.plan}</p> : null}
              <p className="mt-2 text-[12px] text-ink-soft">Led by {g.leader}</p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-ink-soft">Members</span>
                  <span className="font-mono">
                    {g.members} / {g.capacity}
                  </span>
                </div>
                <div className="mt-1.5">
                  <Progress value={(g.members / g.capacity) * 100} tone="lime" />
                </div>
              </div>

              <div className="mt-auto pt-5">
                <button
                  onClick={() =>
                    setJoined((j) => (isJoined ? j.filter((x) => x !== g.id) : [...j, g.id]))
                  }
                  disabled={full && !isJoined}
                  className={`w-full rounded-lg py-2.5 text-[13px] font-semibold ${
                    isJoined
                      ? "bg-teal/15 text-teal"
                      : full
                        ? "cursor-not-allowed bg-muted text-ink-soft"
                        : "bg-navy text-primary-foreground"
                  }`}
                >
                  {isJoined ? "You're in this group" : full ? "Group full" : "Join group"}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5">
        <Label>Start a daily Bible study or prayer group</Label>
        <p className="mt-2 text-[13px] text-ink-soft">
          Choose the daily time that suits your group, keep it between 2 and 50 members, and meet in person or online
          from anywhere in the world. Groups are approved by your campus coordinator before members outside your cohort
          can join.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Group name (e.g. Daily Word · Lekki 6AM)"
            className="rounded-md bg-background px-3 py-2 text-[13px] ring-1 ring-line outline-none"
          />
          <select
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value as typeof form.kind })}
            className="rounded-md bg-background px-3 py-2 text-[13px] ring-1 ring-line outline-none"
          >
            <option>Daily Bible Study</option>
            <option>Prayer Meeting</option>
            <option>Study Group</option>
          </select>
          <select
            value={form.campus}
            onChange={(e) => setForm({ ...form, campus: e.target.value })}
            className="rounded-md bg-background px-3 py-2 text-[13px] ring-1 ring-line outline-none"
          >
            {campusOptions.map((c) => (
              <option key={c.campus}>{c.campus}</option>
            ))}
          </select>
          {form.kind === "Daily Bible Study" ? (
            <>
              <input
                type="time"
                value={form.dailyTime}
                onChange={(e) => setForm({ ...form, dailyTime: e.target.value })}
                className="rounded-md bg-background px-3 py-2 text-[13px] ring-1 ring-line outline-none"
              />
              <select
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="rounded-md bg-background px-3 py-2 text-[13px] ring-1 ring-line outline-none"
              >
                {countries.map((c) => (
                  <option key={c.code}>{c.timezone}</option>
                ))}
              </select>
              <input
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                placeholder="Reading plan (e.g. Bible in one year)"
                className="rounded-md bg-background px-3 py-2 text-[13px] ring-1 ring-line outline-none"
              />
            </>
          ) : (
            <input
              value={form.meets}
              onChange={(e) => setForm({ ...form, meets: e.target.value })}
              placeholder="Meets (e.g. Wed · 7:00 PM)"
              className="rounded-md bg-background px-3 py-2 text-[13px] ring-1 ring-line outline-none"
            />
          )}
          <select
            value={form.mode}
            onChange={(e) => setForm({ ...form, mode: e.target.value as "Physical" | "Online" })}
            className="rounded-md bg-background px-3 py-2 text-[13px] ring-1 ring-line outline-none"
          >
            <option>Physical</option>
            <option>Online</option>
          </select>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Location or meeting link"
            className="rounded-md bg-background px-3 py-2 text-[13px] ring-1 ring-line outline-none"
          />
          <input
            type="number"
            min={2}
            max={50}
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            placeholder="Members (2–50)"
            className="rounded-md bg-background px-3 py-2 text-[13px] ring-1 ring-line outline-none"
          />
        </div>
        <button
          onClick={createGroup}
          className="mt-4 rounded-lg bg-magenta px-4 py-2.5 text-[13px] font-semibold text-accent-foreground"
        >
          Create group
        </button>
      </Card>

      <DemoNote />
    </div>
  );
}
