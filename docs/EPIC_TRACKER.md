# VYVE V1 — EPIC TRACKER

**Sprint Start:** Saturday, March 28, 2026
**Deploy Target:** Railway.com
**Supabase:** Reusing echomind project (kbhonhqjawmnhwxlywwa.supabase.co)
**Focus:** User Engagement + Analytics Insights

---

## Epic 0: Project Foundation & Infrastructure
**Status:** SHIPPED

- [x] Next.js 15 + TypeScript + Tailwind CSS scaffold
- [x] Design system (Vyve Indigo, Amber, Emerald, Rose palette)
- [x] Railway deployment config (standalone output, Dockerfile)
- [x] Environment variables (.env.local + .env.example)
- [x] Supabase schema — all Vyve tables with RLS (`supabase/migrations/001_vyve_schema.sql`)
- [x] Database types (`src/types/database.ts`)
- [x] Supabase client (browser) + admin (server)
- [x] Base layout + fonts (Inter + Plus Jakarta Sans) + metadata
- [x] PostHog provider + event tracking library
- [x] Session ID management
- [x] Project folder structure

---

## Epic 1: Landing Page
**Status:** SHIPPED

- [x] Hero section ("Where do you really stand?")
- [x] Sub-headline + animated CTA button
- [x] Trust line with Shield icon ("Your data stays on your device...")
- [x] Scrolling ticker (7 anonymized benchmark insights)
- [x] Mobile-responsive design
- [x] PostHog: `landing_page_viewed`, `cta_clicked` events
- [x] SEO meta tags + OG metadata

---

## Epic 2: Quiz Engine
**Status:** SHIPPED

- [x] India country config (12 questions, full quiz_schema)
- [x] Quiz state management (React context + provider)
- [x] Question components: Slider, Chips, Dropdown
- [x] Progress bar with step indicators
- [x] Auto-advance (400ms after chip/dropdown selection)
- [x] One question per screen layout
- [x] Q7 tooltip ("Supporting family is strength...")
- [x] "Crunching your numbers..." loading animation (3-step)
- [x] Quiz data saved to Supabase via `/api/quiz/save`
- [x] Back navigation
- [x] PostHog: `quiz_started`, `question_answered`, `quiz_completed`, `quiz_abandoned` events

---

## Epic 3: Scoring Engine + Score Display
**Status:** SHIPPED

- [x] Scoring engine (pure TypeScript): Financial, Career, Health
- [x] Emotional Pulse modifier (weight adjustment by state)
- [x] Web Worker wrapper for client-side execution (with fallback)
- [x] Salary benchmark lookup table (seed data: 40+ city×industry×YoE combos)
- [x] Animated ring counter (0 → score, 1.5s spring)
- [x] Three percentile bars (Financial, Career, Health)
- [x] Confidence badge ("Early estimate")
- [x] "#1 Move" card from lowest-scoring pillar
- [x] Adaptive framing copy (by emotional state: overwhelmed/managing/okay/thriving × low/high)
- [x] Expandable "How we calculate this" methodology
- [x] Score persistence to Supabase
- [x] PostHog: `score_revealed`, `methodology_expanded` events

---

## Epic 4: Action Plan + Auth
**Status:** SHIPPED

- [x] 3 pillar cards (Finance / Career / Health)
- [x] Each card: risk flag (red), win (green), specific action (amber)
- [x] Action library: 22 curated actions with conditional logic
- [x] Phone capture UI (after value delivered)
- [x] OTP send via WhatsApp (Meta Cloud API) + hashed codes in `vyve_otp_codes` (`/api/auth/otp`)
- [x] OTP verify + `vyve_users` upsert by phone (`/api/auth/verify`)
- [x] User profile persistence (vyve_users table)
- [x] "Skip for now" option
- [x] PostHog: `action_plan_viewed`, `action_clicked`, `phone_capture_shown`, `phone_submitted`, `auth_completed`, `auth_skipped` events

---

## Epic 5: WhatsApp Share Mechanic
**Status:** SHIPPED

- [x] OG image generation endpoint (`/api/og` — edge runtime, Satori)
- [x] Dynamic insight card generation based on user's weakest pillar
- [x] Pre-generated cards (3 per user based on scores)
- [x] WhatsApp share button (wa.me deep link)
- [x] Copy link button with clipboard feedback
- [x] Share card template (deep indigo + white + amber)
- [x] Deep link: /check → landing page (with OG metadata)
- [x] PostHog: `share_card_shown`, `share_whatsapp_clicked`, `share_link_copied` events

---

## Epic 6: Monday Morning Brief
**Status:** SHIPPED

- [x] Gemini 2.0 Flash brief generation (`/api/brief/generate`)
- [x] Brief prompt engineering (150 words, warm tone, one insight + one action)
- [x] Score change tracking (week over week)
- [x] Brief persistence (vyve_monday_briefs table)
- [x] Week number calculation
- [ ] Email delivery via Resend (needs RESEND_API_KEY)
- [ ] In-app brief display for returning users
- [ ] Cron scheduling (Railway cron or external)

---

## Epic 7: Analytics & Engagement Insights
**Status:** SHIPPED

- [x] Engagement events API (`/api/engagement` — POST for tracking, GET for metrics)
- [x] Quiz completion rate calculation
- [x] Share rate calculation
- [x] Overview metrics (total quizzes, scores, users)
- [x] Admin dashboard (`/admin`) with KPI cards
- [x] Recent scores table
- [x] "The 3 Numbers That Matter" display (quiz rate, share rate, D7 return)
- [x] Refresh button
- [x] PostHog event library (27 tracked events across full funnel)
- [ ] PostHog feature flags setup (for A/B testing)
- [ ] "Did this feel true?" feedback mechanism

---

## Epic 8: Polish & Beta Launch
**Status:** IN PROGRESS

- [x] Build passes clean (0 errors)
- [x] Standalone output for Railway
- [x] Dockerfile for containerized deploy
- [ ] Run Supabase migration (001_vyve_schema.sql)
- [ ] Configure PostHog project + add key to env
- [ ] Configure Sentry + add DSN to env
- [ ] DNS setup (vyve.app or temporary Railway URL)
- [ ] Railway deploy
- [ ] Supabase anon key (currently using placeholder)
- [ ] Lighthouse audit (target >90)
- [ ] 25-person beta test

---

## File Structure

```
stealth/
├── docs/                     # Product docs + this tracker
├── supabase/migrations/      # SQL schema
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main app (quiz flow orchestrator)
│   │   ├── layout.tsx        # Root layout + PostHog
│   │   ├── globals.css       # Tailwind + Vyve theme
│   │   ├── check/            # Share deep link
│   │   ├── admin/            # Engagement dashboard
│   │   └── api/
│   │       ├── quiz/save/    # Quiz persistence
│   │       ├── auth/otp/     # Send OTP
│   │       ├── auth/verify/  # Verify OTP + create user
│   │       ├── config/       # Country config
│   │       ├── og/           # OG image generation
│   │       ├── engagement/   # Engagement tracking + metrics
│   │       └── brief/        # Monday Brief generation
│   ├── components/
│   │   ├── landing/hero.tsx  # Landing page
│   │   ├── quiz/             # Quiz engine components
│   │   └── score/            # Score, actions, share, phone
│   ├── lib/
│   │   ├── scoring/          # Scoring engine + Web Worker hook
│   │   ├── config/india.ts   # India quiz configuration
│   │   ├── supabase/         # Supabase clients
│   │   ├── analytics/        # PostHog provider + events
│   │   ├── utils.ts          # cn() utility
│   │   └── session.ts        # Session ID management
│   ├── data/
│   │   ├── salary-benchmarks.ts  # Seed salary data
│   │   └── actions-library.ts    # 22 curated actions
│   ├── types/
│   │   ├── quiz.ts           # Quiz + scoring types
│   │   └── database.ts       # Supabase table types
│   └── workers/
│       └── scoring-worker.ts # Web Worker for scoring
├── Dockerfile                # Railway deployment
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env.example
```

---

## Release Strategy

| Release | Epics | Status |
|---------|-------|--------|
| **Alpha** (internal) | 0-7 | CODE COMPLETE |
| **Beta** (25 people) | 0-8 | NEEDS: Supabase migration + Railway deploy |
| **V1 Launch** (500 target) | 0-8 + polish | PENDING |

---

## Next Steps (To Deploy)

1. Run `supabase/migrations/001_vyve_schema.sql` in Supabase SQL Editor
2. Get Supabase **anon key** (not service role) and update `.env.local`
3. Create PostHog project → add `NEXT_PUBLIC_POSTHOG_KEY`
4. Push to GitHub → Connect to Railway → Deploy
5. Set Railway env vars from `.env.example`
6. Test full flow: Landing → Quiz → Score → Actions → Share
