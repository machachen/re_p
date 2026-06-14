# BPM Intelligence — MVP plan (demo → real product)

Status: **awaiting your approval before build.** This captures every confirmed decision so we
build the right thing once.

## Confirmed decisions
- **Backend:** Supabase (managed login + Postgres database + file storage + access rules).
- **Frontend:** keep the current BPM dashboard; swap file-reads for live data. Hosted on a static host.
- **Login:** email + password; admin invites users.
- **Data input (admin):** both — upload a structured Excel template *and* edit via web forms.
- **Roles:** two — `admin` (full power) and `user` (view + send requests to admin).
- **Tenancy:** built multi-client from day one; only 陳氏家族信託 data loaded for now.
- **Privacy:** data loads only after login (access rules enforced server-side) — no public data leak.
- **Cadence:** monthly periods, history retained.

---

## 1. Architecture

```
Browser ──────────────► Static host (Vercel / Cloudflare Pages)
  │                       serves the BPM dashboard + admin panel (HTML/CSS/JS)
  │
  └── Supabase JS SDK ──► Supabase project
                            ├─ Auth        email/password, sessions
                            ├─ Postgres    all report data (+ Row-Level Security)
                            ├─ Storage     PDFs & uploaded files (private buckets)
                            └─ Edge Func   Excel parsing + email notifications
```

The static files can live anywhere — the data is safe because **every query is checked by
Row-Level Security**: a logged-out visitor (or a user from another client) gets nothing.

## 2. Roles & permissions

| Capability | user | admin |
| --- | :--: | :--: |
| View their client's dashboard, asset detail, documents | ✓ | ✓ |
| Download documents | ✓ | ✓ |
| Send a request/message to the admin (optional attachment) | ✓ | ✓ |
| See all clients / switch clients | — | ✓ |
| Upload a period via Excel template | — | ✓ |
| Edit figures via web forms | — | ✓ |
| Upload / remove documents (PDFs) | — | ✓ |
| Publish / unpublish a reporting period | — | ✓ |
| Invite users, set roles, assign users to a client | — | ✓ |
| Read & resolve incoming user requests | — | ✓ |

## 3. Data model (Postgres)

- `clients` — tenant (e.g. 陳氏家族信託). `id, name, …`
- `profiles` — one per auth user. `id (=auth uid), email, full_name, role (admin|user)`
- `memberships` — which users see which client. `user_id, client_id`
- `assets` — `id, client_id, name, type, location, ownership_meta, …`
- `periods` — `id, client_id, period (e.g. 2026-05), published (bool)`
- `portfolio_data` — portfolio-level JSON per period. `client_id, period_id, data (jsonb)`
- `asset_section_data` — per-asset, per-section JSON. `asset_id, period_id, section, data (jsonb)`
- `documents` — `id, client_id, asset_id?, period_id?, title, category, storage_path, uploaded_by, created_at`
- `requests` — user→admin. `id, client_id, user_id, subject, message, attachment_path?, status (open|closed), created_at`

Storing each report section as a `jsonb` blob mirrors today's JSON files exactly, so the
dashboard render code barely changes and the existing Chen data migrates 1:1.

## 4. Content workflow (the "no code" part)

**Excel template (bulk, monthly):** we ship a structured `.xlsx` with one tab per section
(overview, financial, risk, market, …). Admin fills it, uploads in the admin panel; we parse
it (SheetJS) and upsert into the database for that period. Re-uploading replaces that period.

**Web forms (quick edits):** an admin screen with the same fields, for one-off corrections
without re-uploading the whole sheet.

**Documents:** drag-and-drop PDF upload → private Storage bucket → appears in the Documents
tab for that client/asset. Users can view/download; only admins upload/delete.

**Publish control:** a period stays in draft until the admin clicks Publish, so users never
see half-entered data.

## 5. Features by surface

**Viewer (user):** the current dashboard + asset detail (all 7 tabs, all charts), scoped to
their client and the latest *published* period; a period switcher for history; document
downloads; a "send request to analyst" form.

**Admin panel (new):** client switcher; period manager (create/publish); Excel upload; form
editor; document manager; **requests inbox** (with resolve); user management (invite, role,
client assignment).

**Request flow:** user submits → row in `requests` → admin sees it in the inbox → (optional)
admin gets an email. v1 can ship inbox-only; email is a small add-on (needs an email provider key).

## 6. Build phases

1. **Schema & security** — SQL migrations for all tables + Row-Level Security policies. *(no account keys needed — I can start immediately)*
2. **Seed** — convert the existing 陳氏家 JSON into the database as client #1, period 2026-05.
3. **Auth** — real email/password login; session guard on every page; role lookup.
4. **Wire the dashboard** — data-access layer returns the same shapes the UI already expects; replace `fetch('./data/…')`.
5. **Admin panel** — Excel upload + parser, form editor, document upload, period publish.
6. **Requests** — user form → inbox; (optional) email notification.
7. **Deploy & harden** — static host, custom domain (optional), privacy check, backups, QA pass.

## 7. What I need from you (prerequisites)

1. **Create a free Supabase project** (I'll give click-by-click steps) and send me the
   **Project URL** and **anon public key** — both are safe to embed in the frontend. The
   secret `service_role` key stays in Supabase only; it never goes in the frontend or git.
2. **Pick a host:** Vercel or Cloudflare Pages (both free; I'll recommend based on your preference).
3. *(Optional, later)* an email provider key (e.g. Resend) for request notifications, and a custom domain.

I can begin Phase 1–2 (schema + seed) as soon as you approve — those don't need your keys.
We connect everything once your Supabase project exists.

## 8. Cost

The MVP fits inside **free tiers** (Supabase + static host) for a single client. Paid tiers
only matter at higher data/usage; a custom domain is the only likely small recurring cost.
(I'll confirm current numbers when we set up accounts.)

## 9. Not in this MVP (noted for later)
Multi-client onboarding UI, SSO (Google/Microsoft), in-app notifications, audit log,
PDF/report export, and a marketing site — all straightforward to add once the core is live.
