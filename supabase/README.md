# Supabase setup — BPM Intelligence

Everything here is ready to run. Do these steps once to stand up the backend, then send me
two values and I'll wire the app to it.

```
supabase/
├── migrations/
│   ├── 0001_init.sql      # tables + signup trigger
│   ├── 0002_rls.sql       # Row-Level Security (who can read/write)
│   └── 0003_storage.sql   # private file buckets + policies
└── seed/
    ├── build_seed.mjs     # regenerates seed.sql from the demo JSON
    └── seed.sql           # 陳氏家族信託 loaded as client #1, period 2026-05 (published)
```

## 1. Create the project
1. Go to supabase.com → **New project**. Pick the org, name it (e.g. `bpm-intelligence`).
2. **Region:** choose one close to Taiwan — *Southeast Asia (Singapore)* or *Northeast Asia (Tokyo)*.
3. Set a **database password** and save it somewhere safe.

## 2. Apply the schema
Open **SQL Editor** → New query, then run these **in order** (paste the file contents, Run):
1. `migrations/0001_init.sql`
2. `migrations/0002_rls.sql`
3. `migrations/0003_storage.sql`
4. `seed/seed.sql`  ← loads the Chen-family data (safe to re-run)

(If you prefer the CLI: `supabase link` then `supabase db push`, then run the seed.)

## 3. Lock sign-ups to invite-only
**Authentication → Sign In / Providers → Email**: turn **off** "Allow new users to sign up."
Now only users you add can log in. (Optional: disable "Confirm email" so invited users can log
in immediately with the password you set.)

## 4. Create your admin account
1. **Authentication → Users → Add user** → your email + a password (this auto-confirms it).
2. **SQL Editor**, run (replace the email):
   ```sql
   update public.profiles set role = 'admin' where email = 'you@oosga.com';
   insert into public.memberships (user_id, client_id)
     select p.id, c.id from public.profiles p, public.clients c
     where p.email = 'you@oosga.com' and c.slug = 'chen-family'
     on conflict do nothing;
   ```

## 5. (Optional) add a test viewer
**Add user** with another email + password; leave the role as `user`; give them access:
```sql
insert into public.memberships (user_id, client_id)
  select p.id, c.id from public.profiles p, public.clients c
  where p.email = 'viewer@example.com' and c.slug = 'chen-family'
  on conflict do nothing;
```

## 6. Send me two values
**Project Settings → API**:
- **Project URL** (e.g. `https://abcd.supabase.co`)
- **anon public** key

Both are safe to embed in the frontend — Row-Level Security guards the data. **Do NOT** send the
`service_role` key; it stays in Supabase only and never goes in the app or git.

---

### Sanity check (optional)
After the seed, run `select count(*) from asset_section_data;` → should be **21**, and
`select name, slug from clients;` → **陳氏家族信託…**. Log in at the app once I've wired it; an
admin sees everything, a viewer sees only published data for their client.

To regenerate the seed after changing the demo JSON: `node supabase/seed/build_seed.mjs`.
