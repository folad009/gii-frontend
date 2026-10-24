import { queryOptions } from "@tanstack/react-query";
import { ApiError, apiFetch } from "@/lib/api";

export type LessonKind = "Video" | "Text" | "PDF" | "Quiz" | "Reflection";
export type LessonProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type ApiLesson = {
  id: string;
  title: string;
  description: string | null;
  contentType: "VIDEO" | "PDF" | "TEXT" | "QUIZ" | "REFLECTION";
  mimeType: string | null;
  durationSeconds: number | null;
  body: string | null;
  status?: LessonProgressStatus;
  positionSeconds?: number | null;
  completedAt?: string | null;
};

export type ApiModule = {
  id: string;
  name: string;
  sortOrder: number;
  lessons: ApiLesson[];
};

export type ApiCourse = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  modules: ApiModule[];
  completionPercentage?: number;
  attemptStatus?: string;
};

export type OutlineLesson = {
  id: string;
  title: string;
  kind: LessonKind;
  minutes: number;
  done: boolean;
  body: string | null;
  status: LessonProgressStatus;
  positionSeconds: number | null;
};

export type CourseOutline = { module: string; lessons: OutlineLesson[] }[];

const kindByContentType: Record<ApiLesson["contentType"], LessonKind> = {
  VIDEO: "Video",
  PDF: "PDF",
  TEXT: "Text",
  QUIZ: "Quiz",
  REFLECTION: "Reflection",
};

export function courseOutline(course: ApiCourse): CourseOutline {
  return [...(course.modules ?? [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((module) => ({
      module: module.name,
      lessons: (module.lessons ?? []).map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        kind: kindByContentType[lesson.contentType] ?? "Text",
        minutes: lesson.durationSeconds ? Math.max(1, Math.round(lesson.durationSeconds / 60)) : 0,
        done: lesson.status === "COMPLETED",
        body: lesson.body,
        status: lesson.status ?? "NOT_STARTED",
        positionSeconds: lesson.positionSeconds ?? null,
      })),
    }));
}

export function coursesQuery() {
  return queryOptions({
    queryKey: ["courses"],
    queryFn: () => apiFetch<ApiCourse[]>("/api/v1/courses"),
  });
}

export function courseQuery(courseId: string) {
  return queryOptions({
    queryKey: ["courses", courseId],
    queryFn: () => apiFetch<ApiCourse>(`/api/v1/courses/${courseId}`),
  });
}

export type LessonPlayback = {
  playbackUrl: string | null;
  contentType: ApiLesson["contentType"];
  mimeType: string | null;
  title: string;
  body: string | null;
  durationSeconds: number | null;
};

export type LessonProgressUpdate = {
  lessonId: string;
  status: LessonProgressStatus;
  positionSeconds: number | null;
  completedAt: string | null;
  course: {
    completionPercentage: number;
    status: string;
  };
};

export function saveLessonProgress(
  lessonId: string,
  body: { positionSeconds?: number; completed?: boolean },
) {
  return apiFetch<LessonProgressUpdate>(`/api/v1/lessons/${lessonId}/progress`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function applyLessonProgress(course: ApiCourse, update: LessonProgressUpdate): ApiCourse {
  return {
    ...course,
    completionPercentage: update.course.completionPercentage,
    attemptStatus: update.course.status,
    modules: course.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) =>
        lesson.id === update.lessonId
          ? {
              ...lesson,
              status: update.status,
              positionSeconds: update.positionSeconds,
              completedAt: update.completedAt,
            }
          : lesson,
      ),
    })),
  };
}

export function playbackQuery(lessonId: string) {
  return queryOptions({
    queryKey: ["lessons", lessonId, "playback"],
    queryFn: () => apiFetch<LessonPlayback>(`/api/v1/lessons/${lessonId}/playback`),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403 || error.status === 404)) {
        return false;
      }
      return failureCount < 1;
    },
  });
}
