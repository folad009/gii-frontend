/* eslint-disable prettier/prettier */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Card, DemoNote, Label, PageHeader, Pill, Progress, Stat } from "@/components/bits";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { countries, flagFor, learnerRecords } from "@/data/org";
import { createUser, sessionUser, type NewUser } from "@/lib/api";

export const Route = createFileRoute("/records")({
  head: () => ({
    meta: [
      { title: "Learner Records — GII Learning" },
      {
        name: "description",
        content: "The GII learner register: one person, one GIC identity, one learning record across every campus.",
      },
      { property: "og:title", content: "Learner Records — GII Learning" },
      { property: "og:description", content: "Searchable GII learner register across countries and campuses." },
    ],
  }),
  component: Records,
});

const statusTone = (s: string) =>
  s === "On Track" ? "teal" : s === "Completed" ? "navy" : s === "Learning Follow-Up" ? "magenta" : "lime";

const departments: { value: NewUser["department"]; label: string }[] = [
  { value: "ADMINISTRATION", label: "Administration" },
  { value: "MEDIA", label: "Media" },
  { value: "PRAISE_GANG", label: "Praise Gang" },
  { value: "TECH_TEAM", label: "Tech Team" },
  { value: "MINISTRY_TEAM", label: "Ministry Team" },
  { value: "WELFARE_TEAM", label: "Welfare Team" },
  { value: "OUTREACH_TEAM", label: "Outreach Team" },
];

const creatableRoles: { value: NewUser["userRole"]; label: string }[] = [
  { value: "LEARNER", label: "Learner" },
  { value: "INSTRUCTOR", label: "Instructor" },
  { value: "CAMPUS_COORDINATOR", label: "Campus Coordinator" },
  { value: "GII_LEADERSHIP", label: "GII Leadership" },
  { value: "GII_ADMINISTRATOR", label: "GII Administrator" },
];

function AddLearnerDialog() {
  const isSuperAdmin = sessionUser()?.userRole === "SUPER_ADMIN";
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState<NewUser["department"]>("ADMINISTRATION");
  const [userRole, setUserRole] = useState<NewUser["userRole"]>("LEARNER");
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);

  function resetForm() {
    setFullName("");
    setEmail("");
    setPassword("");
    setDepartment("ADMINISTRATION");
    setUserRole("LEARNER");
    setMessage("");
    setFailed(false);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setFailed(false);
    setPending(true);
    try {
      const user = await createUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        userRole: isSuperAdmin ? userRole : "LEARNER",
        department,
      });
      setMessage(`Created ${user.email}`);
      setFullName("");
      setEmail("");
      setPassword("");
      setUserRole("LEARNER");
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "Could not create user");
    } finally {
      setPending(false);
    }
  }

  const field = "mt-1.5 w-full rounded-lg bg-background px-3 py-2.5 text-[14px] ring-1 ring-line outline-none";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground">
        Add learner
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-line bg-card p-5 sm:max-w-lg sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-semibold tracking-tight">Add learner</DialogTitle>
          <DialogDescription className="text-[13px] text-ink-soft">
            {isSuperAdmin
              ? "A new GII Administrator also receives an organisation."
              : "GII Administrators can add learners in their organisation."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[12px] font-semibold">
            Full name
            <input required value={fullName} onChange={(event) => setFullName(event.target.value)} className={field} />
          </label>
          <label className="block text-[12px] font-semibold">
            Email
            <input
              type="email"
              required
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={field}
            />
          </label>
          <label className="block text-[12px] font-semibold">
            Password
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={field}
            />
          </label>
          <label className="block text-[12px] font-semibold">
            Department
            <select
              value={department}
              onChange={(event) => setDepartment(event.target.value as NewUser["department"])}
              className={field}
            >
              {departments.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          {isSuperAdmin ? (
            <label className="block text-[12px] font-semibold sm:col-span-2">
              Role
              <select
                value={userRole}
                onChange={(event) => setUserRole(event.target.value as NewUser["userRole"])}
                className={field}
              >
                {creatableRoles.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {message ? (
            <p className={`text-[13px] sm:col-span-2 ${failed ? "text-magenta" : "text-ink-soft"}`}>{message}</p>
          ) : null}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground disabled:opacity-60"
            >
              {pending ? "Creating…" : "Create user"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Records() {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All countries");
  const [status, setStatus] = useState("All statuses");

  const rows = learnerRecords.filter((r) => {
    if (country !== "All countries" && r.country !== country) return false;
    if (status !== "All statuses" && r.status !== status) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.gicId.toLowerCase().includes(q) ||
      r.campus.toLowerCase().includes(q) ||
      r.programme.toLowerCase().includes(q)
    );
  });

  const select = "rounded-md bg-card px-3 py-2 text-[12px] font-medium ring-1 ring-line outline-none";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Record keeping"
        title="Learner records."
        subtitle="One person · one GIC identity · one learning record"
        action={
          <div className="flex gap-2">
            <button className="rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ring-line">Export CSV</button>
            <AddLearnerDialog />
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Records shown" value={String(rows.length)} note={`of ${learnerRecords.length} demo records`} />
        <Stat label="Countries" value={String(countries.length)} />
        <Stat
          label="Certificates held"
          value={String(learnerRecords.reduce((s, r) => s + r.certificates, 0))}
        />
        <Stat
          label="Needing follow-up"
          value={String(learnerRecords.filter((r) => r.status.includes("Follow-Up")).length)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, GIC ID, campus or programme"
          className="min-w-[240px] flex-1 rounded-md bg-card px-3 py-2 text-[13px] ring-1 ring-line outline-none"
        />
        <select className={select} value={country} onChange={(e) => setCountry(e.target.value)}>
          <option>All countries</option>
          {countries.map((c) => (
            <option key={c.code}>{c.name}</option>
          ))}
        </select>
        <select className={select} value={status} onChange={(e) => setStatus(e.target.value)}>
          {["All statuses", "On Track", "Learning Follow-Up", "Attendance Follow-Up", "Completed"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-line font-mono text-[10px] uppercase tracking-wide text-ink-soft">
              <th className="p-4">GIC ID</th>
              <th className="p-4">Learner</th>
              <th className="p-4">Country / Campus</th>
              <th className="p-4">Programme</th>
              <th className="p-4">Progress</th>
              <th className="p-4">Attendance</th>
              <th className="p-4">Certs</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last activity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.gicId} className="border-b border-line last:border-0">
                <td className="p-4 font-mono text-[12px]">{r.gicId}</td>
                <td className="p-4 font-medium">
                  <Link to="/learners/$learnerId" params={{ learnerId: r.gicId.toLowerCase() }}>
                    {r.name}
                  </Link>
                </td>
                <td className="p-4 text-ink-soft">
                  <span aria-hidden>{flagFor(r.country)}</span> {r.country} · {r.campus}
                </td>
                <td className="p-4">{r.programme}</td>
                <td className="p-4">
                  <div className="w-24">
                    <Progress value={r.progress} tone="teal" />
                  </div>
                </td>
                <td className="p-4 font-mono text-[12px]">{r.attendance}</td>
                <td className="p-4 font-mono text-[12px]">{r.certificates}</td>
                <td className="p-4">
                  <Pill tone={statusTone(r.status) as "teal" | "navy" | "magenta" | "lime"}>{r.status}</Pill>
                </td>
                <td className="p-4 text-ink-soft">{r.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-5">
        <Label>How records are kept</Label>
        <ul className="mt-3 space-y-2 text-[13px] text-ink-soft">
          <li>Each learner has one record, identified by their GIC ID, shared across campuses and countries.</li>
          <li>Records hold learning participation only — enrolments, progress, attendance, results and certificates.</li>
          <li>No spiritual scoring of any kind is recorded or calculated.</li>
          <li>Every edit or export is written to the audit log with the acting user and time.</li>
        </ul>
      </Card>

      <DemoNote />
    </div>
  );
}
