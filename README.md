Job Tracker (ApplyTrack)

Production-ready CRM for tracking job applications with optional Gmail automation.

Tech stack
- React 18 + TypeScript + Vite 5
- Tailwind CSS
- Router: React Router v6 (data router with `createBrowserRouter`)
- Auth/DB: Supabase (email/password + Google OAuth)
- Automation: n8n webhooks (scan + fetch)

Quick start
1) Install deps
```bash
pnpm i
```

2) Configure env (create `.env.local` in project root)
```bash
# Supabase (use the same project for both URL and anon key)
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# n8n
VITE_N8N_BASE_URL=https://primary-production-4915a.up.railway.app
# Optional overrides
# VITE_N8N_SCAN_URL=https://primary-production-4915a.up.railway.app/webhook/scan
# VITE_N8N_APPS_URL=https://primary-production-4915a.up.railway.app/webhook/applications
VITE_WEBHOOK_SECRET=your_shared_secret_if_used
```

3) Supabase Provider settings (Google)
- Scopes: `openid email profile` (do NOT include Gmail scopes here)
- Redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

4) Development
```bash
pnpm run dev
```
App runs on http://localhost:5178

5) Typecheck, lint, build
```bash
npx tsc --noEmit --strict
pnpm run lint
pnpm run build
pnpm run preview
```

Routing
- Public
  - `/` → redirects to `/dashboard` if authed, else `/login`
  - `/login`, `/signup`
- Onboarding (protected)
  - `/onboarding/name-entry` (collect name if missing)
  - `/onboarding/welcome` (personalized welcome, marks onboarding complete)
- Dashboard (protected)
  - `/dashboard/crm` (default) – greeting, Connect Gmail CTA, CRM table, analytics, recent activity
  - `/dashboard/settings` – settings page (extracted from modal; WIP extraction)
  - `/dashboard/upgrade` – freemium → $10/mo upgrade (100 tracks/month)
  - `/dashboard/applications/:id` – application detail route (stub)

Auth model
- Authentication and Gmail permission are separate.
  - Login/Signup: email/password OR Google (basic scopes only: `openid email profile`).
  - Gmail connect happens from dashboard via a separate OAuth flow with `https://www.googleapis.com/auth/gmail.readonly`.
- Name collection is handled in onboarding, not in auth forms.
- Users can use both Google and email/password to sign in to the same account.

Gmail automation
- Connect Gmail button triggers a dedicated OAuth with Gmail scope and offline access.
- On success, the app sets a per-email flag in localStorage `gmail_scopes_granted:<email>`.
- The success toast is shown only once per user/browser and only when connect was explicitly initiated.
- n8n endpoints
  - Scan: POST `${VITE_N8N_SCAN_URL || VITE_N8N_BASE_URL + '/webhook/scan'}`
  - Fetch applications: GET `${VITE_N8N_APPS_URL || VITE_N8N_BASE_URL + '/webhook/applications'}`

Environment notes
- Update `.env.local` and restart the dev server for changes to take effect.
- Ensure Supabase project URL/Anon key match the intended project.

Project scripts
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

Folder structure (key folders)
- `src/components/` – CRM UI, auth form, modals
- `src/routes/` – Router config + route screens (onboarding + dashboard)
- `src/api/n8n.ts` – webhook client
- `src/lib/supabase.ts` – Supabase client
- `src/contexts/ThemeContext.tsx` – dark/light theme persistence

Production checklist
- `pnpm run build` completes with 0 errors
- `npx tsc --noEmit --strict` passes
- Supabase Google provider scopes = `openid email profile`
- Dashboard Connect Gmail uses Gmail scope + redirect query `?gmail_auth=success`
- All routes work in `pnpm run preview`

Troubleshooting
- React error #306 (invalid element type) usually means a lazy import/export mismatch.
  - Ensure lazy routes import default exports or map named → default via `.then(m => ({ default: m.Named }))`.
- “Gmail connected” showing after basic login:
  - Clear localStorage keys `gmail_scopes_granted:<email>` and retry connect from dashboard.
- OAuth exchange errors:
  - Verify Supabase project URL/keys and Google provider settings.
