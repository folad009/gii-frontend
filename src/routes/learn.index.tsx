import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Card, Label, PageHeader } from "@/components/bits";
import { ApiError, hasSession } from "@/lib/api";
import { coursesQuery } from "@/lib/courses";

export const Route = createFileRoute("/learn/")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window !== "undefined" && !hasSession()) {
      throw redirect({ to: "/login" });
    }
  },
  loader: async ({ context }) => {
    try {
      return await context.queryClient.ensureQueryData(coursesQuery());
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) throw redirect({ to: "/login" });
      throw error;
    }
  },
  head: () => ({
    meta: [
      { title: "My Learning — GII Learning" },
      { name: "description", content: "Published Global Impact Institute courses." },
      { property: "og:title", content: "My Learning — GII Learning" },
      { property: "og:description", content: "Published GII courses." },
    ],
  }),
  pendingComponent: () => <p className="text-[13px] text-ink-soft">Loading courses…</p>,
  errorComponent: ({ error }) => (
    <p className="text-[13px] text-magenta">
      {error instanceof ApiError ? error.message : "Courses could not be loaded."}
    </p>
  ),
  component: MyLearning,
});

function MyLearning() {
  const courses = Route.useLoaderData();

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="My learning" title="Published courses." subtitle="Open a course to study its lessons." />

      {courses.length === 0 ? (
        <p className="text-[13px] text-ink-soft">No published courses yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.id} className="p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                {course.modules.length} modules
              </p>
              <p className="mt-4 font-display text-xl font-semibold">{course.title}</p>
              {course.description ? <p className="mt-1 text-[13px] text-ink-soft">{course.description}</p> : null}
              <div className="mt-5">
                <Link
                  to="/learn/$courseSlug"
                  params={{ courseSlug: course.id }}
                  className="rounded-md bg-navy px-3.5 py-2 text-[12px] font-semibold text-primary-foreground"
                >
                  Open course
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="p-5">
        <Label>My learning history</Label>
        <div className="mt-3 divide-y divide-line text-[13px]">
          {[
            ["06 Mar 2026", "Welcome to God's Family completed · certificate issued"],
            ["05 Sep 2026", "Word Foundation started · The Goodland cohort"],
            ["30 Aug 2026", "Module 2 Quiz passed · 80%"],
            ["22 Aug 2026", "Module 1 Quiz passed · 90%"],
          ].map(([date, text]) => (
            <div key={text} className="flex flex-wrap gap-x-4 gap-y-1 py-3">
              <span className="font-mono text-[11px] text-ink-soft">{date}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
