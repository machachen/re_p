# BPM Intelligence — MVP roadmap

How we get from "working prototype" to a real, launchable MVP. Built in thin, testable
slices; deployable at every step; security tested on every slice.

## Confirmed decisions
- **Backend:** Supabase (auth + Postgres + storage + Row-Level Security). Frontend = the BPM dashboard on a static host.
- **Roles:** `admin` (full) · `user` (view own client's published data + send requests).
- **Tenancy:** multi-client data model; only 陳氏家族信託 loaded for now.
- **Content editing:** Excel template upload + form editor (admin, no code).
- **Translation:** **interface bilingual only** — UI strings get EN/繁中; report *content* stays Chinese (no extra monthly work).
- **Extra pages in MVP:** 報告 (Reports) and 情境 (Scenarios) are in. Sidebar filters are out for now (hidden / "coming soon", no dead links).
- **Privacy:** data loads only after login; RLS enforces it server-side.

## Approach — three layers, in order (don't pay for work twice)
1. **Make it work** — the admin panel + the full monthly cycle (M1–M4).
2. **Make it complete** — no dead ends: Reports page, Scenarios page (fold in as plumbing allows).
3. **Make it broad & polished** — interface i18n and mobile, done as single passes *after* the page set is frozen, then final detail polish.

## Done so far (M0 — the walking skeleton)
Schema + RLS, seeded Chen data, email/password auth + session guards, dashboard & asset pages on **live** Supabase data. Login confirmed working.

## Milestones

### M1 — Admin foundation  *(in progress)*
Role-gated admin area; create / **publish** / unpublish periods; document upload (PDF → Storage); and the **single-source-of-truth fix** (report blob is truth; the `assets` table is kept in sync automatically on save).
**Done when:** admin publishes a period and a PDF, a viewer sees them, unpublish hides them; editing a name in one place updates everywhere.
*Slices:* 1) admin shell + role gate + period publish · 2) document upload + manager · 3) data-model sync.

### M2 — Editing without code
Excel template + parser for the monthly figures; form editor for quick fixes; **upload validation** (reject a malformed sheet rather than corrupt a period).
**Done when:** you fill the template, upload, and the dashboard reflects it; a form tweak goes live on refresh.

### M3 — People + requests
Invite / assign users and roles; viewer "send to analyst" form → admin **inbox** (email optional).
**Done when:** you invite a viewer who sees only their client, submits a request, and you resolve it.

### M4 — Harden + launch
Access-control audit (prove a user can't reach another client's data), backups + a tested restore, loading/empty/error states, deploy to the private host + domain, then a **pilot** with one real month.
**Done when:** a full monthly cycle runs end to end, by you, unaided.

## Folded-in pages (Layer 2)
- **報告 / Reports** — archive of published periods + downloadable PDFs. Build alongside M1–M2 (reuses periods + documents).
- **情境 / Scenarios** — portfolio-level scenario/stress feature. Standalone block; schedule after core editing is in.
- **資產 nav** → jumps to the holdings table. Sidebar filters → hidden until built.

## Structure-freeze passes (Layer 3, after pages exist)
- **Interface i18n** — wire the EN/繁中 toggle to swap UI strings (content stays Chinese).
- **Mobile** — one responsive pass (collapse sidebar, stack bands).
- **Detail polish** — copy, spacing, query-combining, before the pilot.

## Cross-cutting (the "real product" tax)
Access-control testing every slice (most important) · data integrity (one source of truth + validated uploads) · backups with a tested restore · graceful loading/empty/error states · a one-page monthly runbook.

## Cutlines (defer to v1.1 — don't block launch)
Multi-client onboarding UI, SSO, email notifications, audit log, PDF export. **Never cut:** access-control correctness, publish gating, backups.

## Definition of done (MVP)
The admin runs a full month — create period → upload figures + documents → publish — with no code or SQL; a viewer logs in, sees only their client's published report, downloads docs, sends a request; access control verified; backups on; deployed privately on a real URL.
