import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/bits";
import { ApiError, hasSession } from "@/lib/api";
import { coursesQuery } from "@/lib/courses";

export const Route = createFileRoute("/explore")({
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
      { title: "Courses — GII Learning" },
      { name: "description", content: "Published Global Impact Institute courses." },
      { property: "og:title", content: "Courses — GII Learning" },
      { property: "og:description", content: "Published courses at Global Impact Institute." },
    ],
  }),
  pendingComponent: () => <p className="text-[13px] text-ink-soft">Loading courses…</p>,
  errorComponent: CourseListError,
  component: Explore,
});

function CourseListError({ error }: { error: Error }) {
  const message = error instanceof ApiError ? error.message : "Courses could not be loaded.";
  return <p className="text-[13px] text-magenta">{message}</p>;
}

function Explore() {
  const courses = Route.useLoaderData();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Courses"
        title="Published courses."
        subtitle="Open a course to see its modules and lessons."
      />

      {courses.length === 0 ? (
        <p className="text-[13px] text-ink-soft">No published courses yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const lessonCount = course.modules.reduce((total, module) => total + module.lessons.length, 0);
            return (
              <Link key={course.id} to="/learn/$courseSlug" params={{ courseSlug: course.id }}>
                <Card className="group h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:ring-magenta/40">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                    {course.modules.length} modules · {lessonCount} lessons
                  </p>
                  <p className="mt-4 font-display text-lg font-semibold leading-snug">{course.title}</p>
                  {course.description ? (
                    <p className="mt-1 text-[13px] text-ink-soft">{course.description}</p>
                  ) : null}
                  <p className="mt-4 text-[12px] font-semibold text-magenta opacity-0 transition-opacity group-hover:opacity-100">
                    Open course →
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
