import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, Label, Pill, Progress } from "@/components/bits";
import { assessment } from "@/data/gii";

export const Route = createFileRoute("/learn/$courseSlug/assessment")({
  head: () => ({
    meta: [
      { title: "Module 3 Assessment — GII Learning" },
      { name: "description", content: "Complete the Word Foundation Module 3 assessment." },
      { property: "og:title", content: "Module 3 Assessment — GII Learning" },
      { property: "og:description", content: "Word Foundation assessment, pass mark 70%." },
    ],
  }),
  component: AssessmentPage,
});

function AssessmentPage() {
  const { courseSlug } = Route.useParams();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = assessment.questions.length;
  const q = assessment.questions[step]!;

  if (submitted) {
    const { score, status, feedback } = assessment.result;
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="p-6 text-center">
          <Label tone="magenta">{assessment.course}</Label>
          <h1 className="mt-2 text-2xl font-semibold">Assessment completed</h1>
          <p className="mt-6 font-display text-6xl font-semibold text-navy">{score}%</p>
          <p className="mt-2 text-[13px] text-ink-soft">Pass mark {assessment.passMark}%</p>
          <div className="mt-4 flex justify-center">
            <Pill tone="teal">{status}</Pill>
          </div>
          <div className="mt-6 rounded-xl border border-line p-4 text-left">
            <Label>Instructor feedback</Label>
            <p className="mt-2 text-[13px]">“{feedback}”</p>
            <p className="mt-3 text-[12px] text-ink-soft">Sarah Okafor · Instructor</p>
          </div>
          <div className="mt-6 rounded-xl bg-muted p-4 text-left">
            <Label>Short answer</Label>
            <p className="mt-2 text-[13px]">Submitted — awaiting review.</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              to="/learn/$courseSlug"
              params={{ courseSlug }}
              className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground"
            >
              Back to course
            </Link>
            <Link to="/" className="rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ring-line">
              My Growth
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Label tone="magenta">{assessment.course}</Label>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{assessment.title}</h1>
        <p className="mt-1 text-[13px] text-ink-soft">
          Question {step + 1} of {total} · Pass mark {assessment.passMark}%
        </p>
        <div className="mt-3">
          <Progress value={((step + 1) / total) * 100} />
        </div>
      </div>

      <Card className="p-6">
        <Pill tone="navy">{q.type}</Pill>
        <p className="mt-4 text-[15px] font-medium">{q.prompt}</p>

        {q.options.length > 0 ? (
          <div className="mt-5 space-y-2">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswers((a) => ({ ...a, [step]: opt }))}
                className={`block w-full rounded-lg px-4 py-3 text-left text-[13px] transition-colors ${
                  answers[step] === opt ? "bg-navy text-primary-foreground" : "ring-1 ring-line hover:bg-muted"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            rows={5}
            value={answers[step] ?? ""}
            onChange={(e) => setAnswers((a) => ({ ...a, [step]: e.target.value }))}
            placeholder="Write your answer…"
            className="mt-5 w-full rounded-lg bg-background p-3 text-[13px] ring-1 ring-line outline-none"
          />
        )}

        <div className="mt-6 flex items-center gap-2">
          <button
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ring-line disabled:opacity-40"
          >
            Previous
          </button>
          {step < total - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground"
            >
              Next question
            </button>
          ) : (
            <button
              onClick={() => setSubmitted(true)}
              className="rounded-lg bg-magenta px-4 py-2.5 text-[13px] font-semibold text-accent-foreground"
            >
              Submit assessment
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
