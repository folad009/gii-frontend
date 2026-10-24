/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import gicLogo from "@/assets/gic-logo.png.asset.json";
import { Card, DemoNote, Label, PageHeader, Pill } from "@/components/bits";
import { adminProfile } from "@/data/org";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({
    meta: [
      { title: "Administrator Profile — GII Learning" },
      {
        name: "description",
        content: "GII administrator profile: role, countries, permissions, security settings and recent activity.",
      },
      { property: "og:title", content: "Administrator Profile — GII Learning" },
      { property: "og:description", content: "Role, permissions and activity for a GII administrator account." },
    ],
  }),
  component: AdminProfile,
});

function AdminProfile() {
  const p = adminProfile;
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Administrator profile" title={p.name} subtitle={p.role} />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="flex items-center gap-3">
            <img src={gicLogo.url} alt="Global Impact Church" className="size-14 rounded-lg object-contain" />
            <div>
              <p className="font-display text-lg font-semibold">{p.name}</p>
              <p className="text-[12px] text-ink-soft">{p.role}</p>
            </div>
          </div>
          <dl className="mt-5 space-y-2 text-[13px]">
            {[
              ["GIC ID", p.gicId],
              ["Email", p.email],
              ["Phone", p.phone],
              ["Scope", p.campus],
              ["Administrator since", p.since],
              ["Last sign-in", p.lastSignIn],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-ink-soft">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground">
              Edit profile
            </button>
            <button className="rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ring-line">
              Change password
            </button>
          </div>
        </Card>

        <div className="space-y-5 lg:col-span-2">
          <Card className="p-5">
            <Label>Countries in scope</Label>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.countries.map((c) => (
                <Pill key={c} tone="navy">
                  {c}
                </Pill>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <Label>Security</Label>
            <div className="mt-3 space-y-3 text-[13px]">
              <div className="flex items-center justify-between gap-3">
                <span>Multi-factor authentication</span>
                <Pill tone="teal">{p.mfa ? "Enabled" : "Disabled"}</Pill>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Access model</span>
                <span className="text-ink-soft">Role-based, least privilege</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Restricted information</span>
                <span className="text-ink-soft">Pastoral notes not visible to this role</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Actions recorded in audit log</span>
                <Pill tone="teal">Yes</Pill>
              </div>
            </div>
          </Card>

          <Card className="overflow-x-auto">
            <div className="p-4">
              <Label>Permissions</Label>
            </div>
            <table className="w-full min-w-[520px] text-left text-[13px]">
              <thead>
                <tr className="border-y border-line font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                  <th className="p-4">Area</th>
                  <th className="p-4">Level</th>
                </tr>
              </thead>
              <tbody>
                {p.permissions.map((perm) => (
                  <tr key={perm.area} className="border-b border-line last:border-0">
                    <td className="p-4 font-medium">{perm.area}</td>
                    <td className="p-4 text-ink-soft">{perm.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="p-5">
            <Label>Recent activity</Label>
            <div className="mt-3 divide-y divide-line text-[13px]">
              {p.activity.map((a) => (
                <div key={a.action} className="flex flex-wrap items-center gap-3 py-3">
                  <span className="font-mono text-[11px] text-ink-soft">{a.date}</span>
                  <span className="font-medium">{a.action}</span>
                  <span className="ml-auto">
                    <Pill tone="teal">{a.status}</Pill>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <DemoNote />
    </div>
  );
}
