import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { Card, Label, Progress } from "@/components/bits";
import { ApiError, hasSession } from "@/lib/api";
import {
  applyLessonProgress,
  courseOutline,
  courseQuery,
  playbackQuery,
  saveLessonProgress,
  type ApiCourse,
  type OutlineLesson,
} from "@/lib/courses";

export const Route = createFileRoute("/learn/$courseSlug")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window !== "undefined" && !hasSession()) {
      throw redirect({ to: "/login" });
    }
  },
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(courseQuery(params.courseSlug));
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) throw notFound();
      if (error instanceof ApiError && error.status === 401) throw redirect({ to: "/login" });
      throw error;
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Course unavailable — GII Learning" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.title} — Course player` },
        { name: "description", content: `Lessons for ${loaderData.title}.` },
        { property: "og:title", content: `${loaderData.title} — GII Learning` },
        { property: "og:description", content: loaderData.description ?? loaderData.title },
      ],
    };
  },
  pendingComponent: () => <p className="text-[13px] text-ink-soft">Loading course…</p>,
  component: CoursePlayer,
});

function CoursePlayer() {
  const params = Route.useParams();
  const loaded = Route.useLoaderData();
  const queryClient = useQueryClient();
  const courseQueryOptions = courseQuery(params.courseSlug);
  const { data } = useQuery(courseQueryOptions);
  const course = data ?? loaded;
  const outline = courseOutline(course);
  const flat = outline.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, module: module.module })));
  const [activeId, setActiveId] = useState(flat[0]?.id ?? "");
  const [quality, setQuality] = useState("Auto");
  const [notes, setNotes] = useState("");
  const [audioOnly, setAudioOnly] = useState(false);
  const [marking, setMarking] = useState(false);
  const [markError, setMarkError] = useState("");
  const resumeAt = useRef<Record<string, number>>({});

  const index = Math.max(0, flat.findIndex((lesson) => lesson.id === activeId));
  const lesson = flat[index];
  const progress = course.completionPercentage ?? 0;
  const canMark = lesson?.kind === "PDF" || lesson?.kind === "Text" || lesson?.kind === "Reflection";

  async function recordProgress(lessonId: string, body: { positionSeconds?: number; completed?: boolean }) {
    const update = await saveLessonProgress(lessonId, body);
    queryClient.setQueryData<ApiCourse>(courseQueryOptions.queryKey, (current) =>
      applyLessonProgress(current ?? course, update),
    );
  }

  async function markComplete() {
    if (!lesson || lesson.status === "COMPLETED") return;
    setMarking(true);
    setMarkError("");
    try {
      await recordProgress(lesson.id, { completed: true });
    } catch (error) {
      setMarkError(error instanceof ApiError ? error.message : "Could not save this lesson");
    } finally {
      setMarking(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link to="/explore" className="font-mono text-[10px] uppercase tracking-[0.2em] text-magenta">
            ← {course.title}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {lesson?.title ?? course.title}
          </h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            {lesson ? lessonMeta(lesson) : "No lessons yet"}
          </p>
        </div>
        <div className="min-w-[180px]">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-ink-soft">Course progress</span>
            <span className="font-mono text-magenta">{progress}%</span>
          </div>
          <div className="mt-1.5">
            <Progress value={progress} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)_280px]">
        <Card className="h-max p-4">
          <Label>Course outline</Label>
          <div className="mt-3 space-y-4">
            {outline.length === 0 ? (
              <p className="text-[12px] text-ink-soft">This course has no modules yet.</p>
            ) : (
              outline.map((module) => (
                <div key={module.module}>
                  <p className="text-[12px] font-semibold">{module.module}</p>
                  <ul className="mt-1.5 space-y-0.5">
                    {module.lessons.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveId(item.id)}
                          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] ${
                            item.id === lesson?.id ? "bg-navy text-primary-foreground" : "hover:bg-muted"
                          }`}
                        >
                          <span
                            className={`size-1.5 shrink-0 rounded-full ${
                              item.status === "COMPLETED" ? "bg-lime" : "bg-ink/20"
                            }`}
                          />
                          <span className="min-w-0 flex-1 truncate">{item.title}</span>
                          <span className="font-mono text-[9px] uppercase opacity-70">{item.kind}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="space-y-5">
          {lesson ? (
            <LessonStage
              lesson={lesson}
              courseId={course.id}
              resumeAt={resumeAt}
              quality={quality}
              onQuality={setQuality}
              audioOnly={audioOnly}
              onAudioOnly={() => setAudioOnly((value) => !value)}
              onProgress={(seconds) => recordProgress(lesson.id, { positionSeconds: seconds })}
            />
          ) : (
            <Card className="p-5">
              <p className="text-[14px] text-ink-soft">This course has no lessons yet.</p>
            </Card>
          )}

          {lesson ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                disabled={index === 0}
                onClick={() => setActiveId(flat[index - 1]!.id)}
                className="rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ring-line disabled:opacity-40"
              >
                Previous
              </button>
              {canMark ? (
                <button
                  type="button"
                  disabled={marking || lesson.status === "COMPLETED"}
                  onClick={() => void markComplete()}
                  className={`rounded-lg px-4 py-2.5 text-[13px] font-semibold disabled:opacity-70 ${
                    lesson.status === "COMPLETED" ? "bg-teal/15 text-teal" : "bg-magenta text-accent-foreground"
                  }`}
                >
                  {lesson.status === "COMPLETED" ? "Completed" : "Mark as complete"}
                </button>
              ) : null}
              <button
                disabled={index === flat.length - 1}
                onClick={() => setActiveId(flat[index + 1]!.id)}
                className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground disabled:opacity-40"
              >
                Next lesson
              </button>
              <Link
                to="/learn/$courseSlug/assessment"
                params={{ courseSlug: course.id }}
                className="rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ring-line"
              >
                Take assessment
              </Link>
            </div>
          ) : null}
          {markError ? <p className="text-[13px] text-magenta">{markError}</p> : null}
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <Label>My notes</Label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="Write a note for this lesson…"
              className="mt-3 w-full rounded-lg bg-background p-3 text-[13px] ring-1 ring-line outline-none"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

function lessonMeta(lesson: OutlineLesson & { module: string }) {
  const minutes = lesson.minutes > 0 ? ` · ${lesson.minutes} min` : "";
  return `${lesson.module} · ${lesson.kind}${minutes}`;
}

function formatClock(seconds: number) {
  const whole = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(whole / 60);
  const remainder = whole % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function LessonStage({
  lesson,
  courseId,
  resumeAt,
  quality,
  onQuality,
  audioOnly,
  onAudioOnly,
  onProgress,
}: {
  lesson: OutlineLesson & { module: string };
  courseId: string;
  resumeAt: MutableRefObject<Record<string, number>>;
  quality: string;
  onQuality: (value: string) => void;
  audioOnly: boolean;
  onAudioOnly: () => void;
  onProgress: (seconds: number) => Promise<void>;
}) {
  const playback = useQuery(playbackQuery(lesson.id));
  const data = playback.data;
  const missingFile =
    (playback.error instanceof ApiError && playback.error.status === 404) ||
    (data != null && (lesson.kind === "Video" || lesson.kind === "PDF") && !data.playbackUrl);

  if (lesson.kind === "Quiz") {
    return (
      <Card className="p-5">
        <Label>Quiz</Label>
        <p className="mt-2 text-[14px]">{lesson.title}</p>
        <Link
          to="/learn/$courseSlug/assessment"
          params={{ courseSlug: courseId }}
          className="mt-4 inline-block rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground"
        >
          Open assessment
        </Link>
      </Card>
    );
  }

  if (lesson.kind === "Text" || lesson.kind === "Reflection") {
    const body = data?.body ?? lesson.body;
    return (
      <Card className="p-5">
        <Label>{lesson.kind}</Label>
        <h2 className="mt-2 text-xl font-semibold">{data?.title ?? lesson.title}</h2>
        <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed">
          {body || "This lesson has no text yet."}
        </p>
      </Card>
    );
  }

  if (playback.isPending) {
    return <p className="text-[13px] text-ink-soft">Loading lesson…</p>;
  }

  if (playback.error && !missingFile) {
    const message = playback.error instanceof ApiError ? playback.error.message : "This lesson could not be loaded.";
    return <p className="text-[13px] text-magenta">{message}</p>;
  }

  if (missingFile || !data?.playbackUrl) {
    return (
      <Card className="overflow-hidden">
        <div className="flex aspect-video w-full items-center justify-center bg-navy px-6 text-center text-primary-foreground">
          <p className="text-[14px]">This lesson has no file yet</p>
        </div>
      </Card>
    );
  }

  if (lesson.kind === "PDF") {
    return (
      <Card className="overflow-hidden">
        <iframe title={data.title || lesson.title} src={data.playbackUrl} className="h-[70vh] w-full bg-white" />
      </Card>
    );
  }

  const durationSeconds = data.durationSeconds ?? (lesson.minutes > 0 ? lesson.minutes * 60 : null);
  const playable = !data.mimeType || data.mimeType === "video/mp4";

  return (
    <Card className="overflow-hidden">
      {playable ? (
        <VideoFile
          lessonId={lesson.id}
          src={data.playbackUrl}
          resumeAt={resumeAt}
          positionSeconds={lesson.positionSeconds}
          completed={lesson.status === "COMPLETED"}
          onProgress={onProgress}
        />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-navy px-6 text-center text-primary-foreground">
          <p className="text-[14px]">Only an MP4 can be played here.</p>
        </div>
      )}
      <div className="space-y-3 border-t border-line p-4">
        <p className="text-[14px] font-semibold">
          {data.title || lesson.title}
          {durationSeconds != null ? (
            <span className="ml-2 font-mono text-[12px] font-normal text-ink-soft">{formatClock(durationSeconds)}</span>
          ) : null}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-[12px]">
            <span className="text-ink-soft">Quality</span>
            <select
              value={quality}
              onChange={(event) => onQuality(event.target.value)}
              className="rounded-md bg-card px-2 py-1.5 text-[12px] ring-1 ring-line outline-none"
            >
              {["Auto", "144p (lowest data)", "360p", "720p"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={onAudioOnly}
            className={`rounded-md px-3 py-1.5 text-[12px] font-semibold ${
              audioOnly ? "bg-teal/15 text-teal" : "ring-1 ring-line"
            }`}
          >
            {audioOnly ? "Audio-only preference on" : "Audio-only preference"}
          </button>
        </div>
      </div>
    </Card>
  );
}

function VideoFile({
  lessonId,
  src,
  resumeAt,
  positionSeconds,
  completed,
  onProgress,
}: {
  lessonId: string;
  src: string;
  resumeAt: MutableRefObject<Record<string, number>>;
  positionSeconds: number | null;
  completed: boolean;
  onProgress: (seconds: number) => Promise<void>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSent = useRef(0);
  const announcedComplete = useRef(completed);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  const remember = (video: HTMLVideoElement) => {
    if (video.currentTime > 0) resumeAt.current[lessonId] = video.currentTime;
  };

  const send = (video: HTMLVideoElement, force: boolean) => {
    remember(video);
    const seconds = Math.floor(video.currentTime);
    if (seconds <= 0) return;
    const now = Date.now();
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const crossing = duration > 0 && video.currentTime >= duration * 0.9 && !announcedComplete.current;
    if (!force && !crossing && now - lastSent.current < 10_000) return;
    if (crossing) announcedComplete.current = true;
    lastSent.current = now;
    void onProgressRef.current(seconds);
  };

  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (!video || video.currentTime <= 0) return;
      resumeAt.current[lessonId] = video.currentTime;
      void onProgressRef.current(Math.floor(video.currentTime));
    };
  }, [lessonId, resumeAt]);

  return (
    <video
      ref={videoRef}
      key={lessonId}
      controls
      playsInline
      src={src}
      className="aspect-video w-full bg-black"
      onTimeUpdate={(event) => send(event.currentTarget, false)}
      onPause={(event) => send(event.currentTarget, true)}
      onEnded={(event) => send(event.currentTarget, true)}
      onLoadedMetadata={(event) => {
        const visit = resumeAt.current[lessonId];
        const saved = visit && visit > 0 ? visit : (positionSeconds ?? 0);
        if (saved > 0 && saved < event.currentTarget.duration) {
          event.currentTarget.currentTime = saved;
        }
      }}
    />
  );
}
