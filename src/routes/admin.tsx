/* eslint-disable prettier/prettier */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLayoutEffect, useState, type FormEvent } from "react";
import { Card, DemoNote, Label, PageHeader, Pill, Stat } from "@/components/bits";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { adminStats, cohorts, contentQueue } from "@/data/gii";
import { countries } from "@/data/org";
import { createCourseDraft, createCourseModule, sessionUser } from "@/lib/api";
import { requireSession } from "@/lib/sessionGuard";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    requireSession();
  },
  head: () => ({
    meta: [
      { title: "GII Administration — Dashboard" },
      {
        name: "description",
        content: "Administer GII programmes, cohorts, content approval, certificates and records across countries.",
      },
      { property: "og:title", content: "GII Administration — Dashboard" },
      { property: "og:description", content: "Programmes, cohorts, content approval and records for GII administrators." },
    ],
  }),
  component: Admin,
});

const adminAreas = [
  "Programmes",
  "Courses",
  "Modules",
  "Content",
  "Cohorts",
  "Learners",
  "Instructors",
  "Assessments",
  "Attendance",
  "Certificates",
  "Reports",
  "Content Approval",
  "System Settings",
  "Integrations",
  "Users & Roles",
  "Audit Log",
];

function useCanAddCourse() {
  const [allowed, setAllowed] = useState(false);
  useLayoutEffect(() => {
    const role = sessionUser()?.userRole;
    setAllowed(role === "GII_ADMINISTRATOR" || role === "SUPER_ADMIN");
  }, []);
  return allowed;
}

function AddCourseDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);

  function resetForm() {
    setStep(1);
    setTitle("");
    setDescription("");
    setCourseId("");
    setModuleName("");
    setMessage("");
    setFailed(false);
  }

  async function onCreateCourse(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setFailed(false);
    setPending(true);
    try {
      const course = await createCourseDraft({
        title: title.trim(),
        description: description.trim(),
      });
      setCourseId(course.id);
      setTitle(course.title || title.trim());
      setStep(2);
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "Could not create course");
    } finally {
      setPending(false);
    }
  }

  async function onCreateModule(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setFailed(false);
    setPending(true);
    try {
      const created = await createCourseModule(courseId, { name: moduleName.trim() });
      setMessage(`Created ${created.name}`);
      setModuleName("");
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "Could not create module");
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
        Add course
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-line bg-card p-5 sm:max-w-lg sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-semibold tracking-tight">Add course</DialogTitle>
          <DialogDescription className="text-[13px] text-ink-soft">
            {step === 1
              ? "The course is saved as a draft and stays out of the catalogue."
              : `Course id ${courseId}`}
          </DialogDescription>
        </DialogHeader>
        {step === 1 ? (
          <form onSubmit={onCreateCourse} className="grid gap-4">
            <label className="block text-[12px] font-semibold">
              Title
              <input required value={title} onChange={(event) => setTitle(event.target.value)} className={field} />
            </label>
            <label className="block text-[12px] font-semibold">
              Description
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className={field} />
            </label>
            {message ? <p className={`text-[13px] ${failed ? "text-magenta" : "text-ink-soft"}`}>{message}</p> : null}
            <div>
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground disabled:opacity-60"
              >
                {pending ? "Creating…" : "Create course"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={onCreateModule} className="grid gap-4">
            <label className="block text-[12px] font-semibold">
              Course title
              <input readOnly value={title} className={field} />
            </label>
            <label className="block text-[12px] font-semibold">
              Module name
              <input required value={moduleName} onChange={(event) => setModuleName(event.target.value)} className={field} />
            </label>
            {message ? <p className={`text-[13px] ${failed ? "text-magenta" : "text-ink-soft"}`}>{message}</p> : null}
            <div>
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground disabled:opacity-60"
              >
                {pending ? "Creating…" : "Add module"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Admin() {
  const showAddCourse = useCanAddCourse();
  const totalLearners = countries.reduce(
    (sum, c) => sum + c.campuses.reduce((s, x) => s + x.learners, 0),
    0,
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="GII administration"
        title="Administration dashboard."
        subtitle="Stewarding programmes, people and records."
        action={
          <div className="flex gap-2">
            {showAddCourse ? <AddCourseDialog /> : null}
            <Link
              to="/records"
              className="rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ring-line"
            >
              Learner records
            </Link>
            <Link
              to="/admin/profile"
              className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground"
            >
              My admin profile
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Learners on record" value={totalLearners.toLocaleString()} note={`${countries.length} countries`} />
        <Stat label="Programmes" value={String(adminStats.programmes)} note={`${adminStats.courses} courses`} />
        <Stat label="Cohorts running" value={String(adminStats.cohorts)} note={`${adminStats.instructors} instructors`} />
        <Stat
          label="Awaiting approval"
          value={String(adminStats.awaitingApproval)}
          note={`${adminStats.certificatesThisMonth} certificates this month`}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <Label>Content governance queue</Label>
          <div className="mt-3 divide-y divide-line text-[13px]">
            {contentQueue.map((c) => (
              <div key={c.title} className="flex flex-wrap items-center gap-3 py-3">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-[12px] text-ink-soft">
                    {c.owner} · updated {c.updated}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Pill
                    tone={
                      c.stage === "Theological Approval" ? "magenta" : c.stage === "Review" ? "lime" : "neutral"
                    }
                  >
                    {c.stage}
                  </Pill>
                  <button className="rounded-md px-3 py-1.5 text-[12px] font-semibold ring-1 ring-line">Open</button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-muted p-3 text-[12px] text-ink-soft">
            Draft → Review → Theological Approval → Published → Versioned → Archived. Unapproved content never appears
            in the learner catalogue.
          </p>
        </Card>

        <Card className="p-5">
          <Label>Administration areas</Label>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {adminAreas.map((a) => (
              <span key={a} className="rounded-full px-2.5 py-1 text-[12px] ring-1 ring-line">
                {a}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <div className="flex items-center justify-between p-4">
          <Label>Countries and campuses</Label>
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">Multi-country</span>
        </div>
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead>
            <tr className="border-y border-line font-mono text-[10px] uppercase tracking-wide text-ink-soft">
              <th className="p-4">Country</th>
              <th className="p-4">Campus</th>
              <th className="p-4">City</th>
              <th className="p-4">Coordinator</th>
              <th className="p-4">Learners</th>
              <th className="p-4">Time zone</th>
            </tr>
          </thead>
          <tbody>
            {countries.flatMap((c) =>
              c.campuses.map((campus) => (
                <tr key={c.code + campus.name} className="border-b border-line last:border-0">
                  <td className="p-4 font-medium">
                    <span aria-hidden>{c.flag}</span> {c.name}
                  </td>
                  <td className="p-4">{campus.name}</td>
                  <td className="p-4 text-ink-soft">{campus.city}</td>
                  <td className="p-4 text-ink-soft">{campus.coordinator}</td>
                  <td className="p-4 font-mono">{campus.learners}</td>
                  <td className="p-4 text-ink-soft">{c.timezone}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <Label>Cohorts</Label>
          <Link to="/cohorts" className="text-[12px] font-semibold text-magenta">
            Manage cohorts
          </Link>
        </div>
        <div className="mt-3 divide-y divide-line text-[13px]">
          {cohorts.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="font-medium">{c.course}</span>
              <span className="text-ink-soft">
                {c.campus} · {c.label}
              </span>
              <span className="ml-auto font-mono text-[12px] text-ink-soft">
                {c.active} active / {c.registered} registered
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <Label>Audit log</Label>
        <div className="mt-3 divide-y divide-line text-[13px]">
          {[
            ["09 Sep 2026", "Published Word Foundation v2.1", "GII Administrator", "Completed"],
            ["08 Sep 2026", "Created cohort — Harbour View October 2026", "GII Administrator", "Completed"],
            ["07 Sep 2026", "Role assigned — Campus Coordinator (Accra)", "IT Administrator", "Completed"],
          ].map(([date, action, user, status]) => (
            <div key={action} className="flex flex-wrap items-center gap-3 py-3">
              <span className="font-mono text-[11px] text-ink-soft">{date}</span>
              <span className="font-medium">{action}</span>
              <span className="text-ink-soft">{user}</span>
              <span className="ml-auto">
                <Pill tone="teal">{status}</Pill>
              </span>
            </div>
          ))}
        </div>
      </Card>

      <DemoNote />
    </div>
  );
}
