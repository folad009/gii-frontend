import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, DemoNote, Label, PageHeader, Pill } from "@/components/bits";
import { programmes, studyVideos, type StudyVideo } from "@/data/gii";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Study Videos — Achieve Greatness | GII Learning" },
      {
        name: "description",
        content:
          "Watch and study the PYD Achieve Greatness teachings with Pastor Yemi Davids, with discussion questions for small groups.",
      },
      { property: "og:title", content: "Study Videos — Achieve Greatness | GII Learning" },
      {
        property: "og:description",
        content: "PYD Achieve Greatness video teachings with group discussion questions for GII discipleship.",
      },
    ],
  }),
  component: Videos,
});

/** Accepts a full YouTube URL or a bare id and returns the video id. */
function parseYouTubeId(input: string): string | null {
  const v = input.trim();
  if (!v) return null;
  if (/^[\w-]{11}$/.test(v)) return v;
  const m =
    v.match(/[?&]v=([\w-]{11})/) ||
    v.match(/youtu\.be\/([\w-]{11})/) ||
    v.match(/embed\/([\w-]{11})/) ||
    v.match(/live\/([\w-]{11})/) ||
    v.match(/shorts\/([\w-]{11})/);
  return m ? m[1]! : null;
}

function Videos() {
  const [library, setLibrary] = useState<StudyVideo[]>(studyVideos);
  const [active, setActive] = useState(studyVideos[0]?.id ?? "");
  const [form, setForm] = useState({ url: "", title: "", date: "", programme: programmes[1]!.title });
  const [error, setError] = useState("");

  const current = library.find((v) => v.id === active) ?? library[0];

  const add = () => {
    const id = parseYouTubeId(form.url);
    if (!id) {
      setError("Paste a full YouTube link, for example https://www.youtube.com/watch?v=…");
      return;
    }
    if (!form.title.trim()) {
      setError("Give the teaching a title so learners can find it.");
      return;
    }
    const video: StudyVideo = {
      id: `v-${Date.now()}`,
      youtubeId: id,
      title: form.title.trim(),
      series: "PYD · Achieve Greatness with Yemi Davids",
      speaker: "Pastor Yemi Davids",
      date: form.date.trim() || "Date to be confirmed",
      length: "Full teaching",
      programme: form.programme,
      scripture: "Discussion notes to be added by the study leader",
      questions: [
        "What one truth from this teaching spoke to you most?",
        "What is God asking you to do about it?",
        "What will you do differently this week?",
      ],
    };
    setLibrary((l) => [video, ...l]);
    setActive(video.id);
    setForm({ url: "", title: "", date: "", programme: form.programme });
    setError("");
  };

  const input = "w-full rounded-md bg-card px-3 py-2 text-[13px] ring-1 ring-line outline-none";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Discipleship video library"
        title="Achieve Greatness study videos."
        subtitle="Watch a teaching, then study it together — in your group, at your own pace."
        action={
          <a
            href="https://www.youtube.com/@globalimpactchurchtv"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ring-line"
          >
            Global Impact Church TV
          </a>
        }
      />

      {current ? (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="overflow-hidden lg:col-span-2">
            <div className="aspect-video w-full bg-navy">
              <iframe
                key={current.youtubeId}
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${current.youtubeId}`}
                title={current.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <Label>{current.series}</Label>
              <h2 className="mt-2 font-display text-xl font-semibold leading-snug">{current.title}</h2>
              <p className="mt-1 text-[13px] text-ink-soft">
                {current.speaker} · {current.date} · {current.length}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill tone="teal">Linked to {current.programme}</Pill>
                <Pill tone="lime">Group study ready</Pill>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <Label>Study together</Label>
            <p className="mt-2 text-[13px] text-ink-soft">{current.scripture}</p>
            <ol className="mt-4 space-y-3 text-[13px]">
              {current.questions.map((q, i) => (
                <li key={q} className="flex gap-3">
                  <span className="font-mono text-[11px] text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-lg bg-muted p-3 text-[12px] text-ink-soft">
              Watch the teaching before your group meets, then use these questions to discuss and pray together.
            </p>
          </Card>
        </div>
      ) : null}

      <section className="space-y-3">
        <Label>The series</Label>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {library.map((v) => (
            <button key={v.id} onClick={() => setActive(v.id)} className="text-left">
              <Card
                className={`h-full overflow-hidden transition-all ${
                  v.id === current?.id ? "ring-2 ring-magenta/40" : "hover:-translate-y-0.5"
                }`}
              >
                <img
                  src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                  alt={`Thumbnail for ${v.title}`}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
                <div className="p-4">
                  <p className="font-display text-[15px] font-semibold leading-snug">{v.title}</p>
                  <p className="mt-1 text-[12px] text-ink-soft">
                    {v.speaker} · {v.date}
                  </p>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </section>

      <Card className="p-5">
        <Label>Add a teaching to the library</Label>
        <p className="mt-2 text-[13px] text-ink-soft">
          Paste the YouTube link of an Achieve Greatness teaching and it will appear in the series above with group
          questions ready to use.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            className={input}
            placeholder="YouTube link"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
          <input
            className={input}
            placeholder="Title, e.g. Achieve Greatness — 5th August 2026"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className={input}
            placeholder="Date preached, e.g. 05 Aug 2026"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <select
            className={input}
            value={form.programme}
            onChange={(e) => setForm({ ...form, programme: e.target.value })}
          >
            {programmes.map((p) => (
              <option key={p.slug}>{p.title}</option>
            ))}
          </select>
        </div>
        {error ? <p className="mt-3 text-[12px] font-medium text-magenta">{error}</p> : null}
        <button
          onClick={add}
          className="mt-4 rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground"
        >
          Add to library
        </button>
        <p className="mt-3 text-[12px] text-ink-soft">
          In this prototype videos added here stay for this visit only. Nothing is uploaded to YouTube — teachings play
          from the church channel.
        </p>
      </Card>

      <DemoNote />
    </div>
  );
}
