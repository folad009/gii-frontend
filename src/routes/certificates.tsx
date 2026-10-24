import { createFileRoute } from "@tanstack/react-router";
import gicLogo from "@/assets/gic-logo.png.asset.json";
import { Card, DemoNote, Label, PageHeader } from "@/components/bits";
import { certificates, learner } from "@/data/gii";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "My Certificates — GII Learning" },
      { name: "description", content: "View, download and share your Global Impact Institute certificates." },
      { property: "og:title", content: "My Certificates — GII Learning" },
      { property: "og:description", content: "Your GII programme certificates with verification details." },
    ],
  }),
  component: Certificates,
});

function Certificates() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="My certificates" title="Completed programmes." />

      {certificates.map((c) => (
        <div key={c.id} className="space-y-4">
          <Card className="overflow-hidden">
            <div className="brand-rule h-2 w-full" />
            <div className="p-6 text-center sm:p-10">
              <img src={gicLogo.url} alt="Global Impact Church" className="mx-auto size-16 object-contain" />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-soft">
                Global Impact Church
              </p>
              <p className="font-display text-lg font-semibold text-navy">Global Impact Institute</p>

              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                This certificate is awarded to
              </p>
              <p className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{learner.name}</p>
              <p className="mt-4 text-[13px] text-ink-soft">for the successful completion of</p>
              <p className="mt-1 font-display text-2xl font-semibold text-magenta">{c.programme}</p>

              <div className="mx-auto mt-10 grid max-w-2xl gap-6 text-left sm:grid-cols-3">
                <div>
                  <Label>Completion date</Label>
                  <p className="mt-1 text-[13px] font-medium">{c.issued}</p>
                </div>
                <div>
                  <Label>Certificate number</Label>
                  <p className="mt-1 font-mono text-[13px]">{c.id}</p>
                </div>
                <div>
                  <Label>Verification</Label>
                  <div className="mt-1 grid size-16 place-items-center rounded-md border border-dashed border-line bg-muted">
                    <span className="font-mono text-[8px] uppercase tracking-wide text-ink-soft">QR</span>
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-10 max-w-xs border-t border-line pt-3">
                <p className="font-display text-[13px] italic text-ink-soft">Authorised signatory</p>
                <p className="text-[12px] text-ink-soft">{c.signatory}</p>
              </div>
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            <button className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground">
              View certificate
            </button>
            <button className="rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ring-line">Download</button>
            <button className="rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ring-line">Share</button>
          </div>
        </div>
      ))}

      <DemoNote>
        Certificate content is fictional demo data. Verification codes are placeholders in this prototype.
      </DemoNote>
    </div>
  );
}
