# VYVE — EXECUTION PLAN v1

## The Single Document That Runs The Company

**Sprint Start:** Saturday, March 28, 2026
**Team:** CEO (Avin) + CTO (Co-Founder)
**Budget:** Bootstrapped. Rs.50,000/month.
**Brand:** Vyve (working name — final confirmation pending)
**Tagline:** "See your life clearly."

---

> **The 90-day mission: 25 people in Bengaluru look at their score and say "this feels true." Then 500 people share it. Everything else is downstream.**

---

## PART 1: WHAT WE BUILD (The 5 Features of V1)


| #   | Feature                                   | Owner                            | Why It's In V1                                                    |
| --- | ----------------------------------------- | -------------------------------- | ----------------------------------------------------------------- |
| 1   | **12-Question Quiz**                      | CTO (engine) + CEO (copy/UX)     | The front door. If this isn't frictionless, nothing else matters. |
| 2   | **Score Display + Percentile Benchmarks** | CTO (scoring) + CEO (framing)    | The moment of truth. Must feel TRUE.                              |
| 3   | **Priority Action Plan**                  | CEO (content) + CTO (rendering)  | The "so what" — score without action is a novelty, not a product. |
| 4   | **Monday Morning Brief**                  | CTO (pipeline) + CEO (templates) | The retention engine. Without it, we're a one-time quiz.          |
| 5   | **WhatsApp Insight Share Card**           | CTO (OG generation) + CEO (copy) | The growth engine. Zero-cost acquisition.                         |


### The 20 Things We Explicitly DON'T Build


| Feature                               | Why Not V1                                         | When      |
| ------------------------------------- | -------------------------------------------------- | --------- |
| Mobile app (React Native)             | Web-first. Don't split 2 engineers.                | Month 3-4 |
| "What If" Simulator                   | Engagement weapon, but needs retained users first. | Month 3   |
| Marketplace (SIP/insurance referrals) | Revenue is a distraction before PMF.               | Month 4   |
| Plus/Pro subscription tiers           | Don't paywall before proving value.                | Month 4   |
| ActiveMatch venue database            | Manually curate 50 venues later.                   | Month 4-6 |
| Wearable integration                  | Self-reported data is enough for V1.               | Month 6+  |
| Account Aggregator                    | Complex, regulated.                                | Month 9+  |
| Festival financial nudges             | Seasonal. Build before Diwali (Oct 2026).          | Month 4   |
| Marriage Readiness Score              | Viral but not core.                                | Month 8   |
| Tax Season Mode                       | Build before Jan 2027.                             | Month 10  |
| Cohort Leagues / Gamification         | Needs 1K+ users per cohort.                        | Month 6   |
| B2B Employer Dashboard                | Different product, buyer, sales cycle.             | Month 12  |
| Streaks                               | Needs retained users first.                        | Month 3-4 |
| Full Life Event Mode                  | Basic version in V1. Full at Month 4.              | Month 2-4 |
| Dynamic city-tier pricing             | One price nationally first.                        | Month 6   |
| Hindi interface                       | English-first for IT pro beachhead.                | Year 2    |
| Parents Score                         | Brilliant, but needs rock-solid core.              | Year 2    |
| UK/Indonesia/US anything              | Zero non-India effort for 12-18 months.            | Year 2    |
| API licensing                         | We don't have the data yet.                        | Year 4    |
| AI deep action plans                  | Hand-crafted actions beat generic AI.              | Month 6+  |


---

## PART 2: THE 5 SCREENS — DETAILED SPEC

### Screen 1: Landing Page

**Hero:** "Where do you really stand?"
**Sub:** "Your money. Your career. Your health. Compared to real peers. 2 minutes. Free. No sign-up."
**CTA:** "Check My Score — Free"
**Trust line:** "Your data stays on your device. We never sell it. Delete everything in 2 taps."
**Scrolling ticker:** Anonymized insights from benchmark data ("54% of tech professionals your age save less than 10%")

**Success metric:** >60% of visitors tap the CTA.

### Screen 2: 12-Question Quiz

One question per screen. All taps. Zero typing. Progress bar. Auto-advance 400ms after selection. ~2.5 minutes total.


| #   | Question                    | Input                | Options                                                              | Scoring Use               |
| --- | --------------------------- | -------------------- | -------------------------------------------------------------------- | ------------------------- |
| 1   | How old are you?            | Slider 22-55         | Default: 28                                                          | Cohort formation          |
| 2   | Which city do you live in?  | Dropdown (20 cities) | Top 5 pinned: BLR, MUM, HYD, PUN, DEL                                | Cohort + geography        |
| 3   | Monthly in-hand salary?     | Range chips          | <30K / 30-50K / 50-75K / 75K-1.2L / 1.2-2L / 2L+                     | Financial + Career bench  |
| 4   | Savings/investment rate?    | Range chips          | 0% / <5% / 5-10% / 10-20% / 20%+                                     | Savings percentile        |
| 5   | Term life insurance?        | Chips                | Yes / No / Not Sure                                                  | Insurance risk flag       |
| 6   | EMIs as % of salary?        | Range chips          | No EMIs / <20% / 20-40% / 40%+                                       | Debt burden               |
| 7   | Support family financially? | Chips                | No / <10% / 10-20% / 20%+                                            | Family-adjusted bench     |
| 8   | Industry?                   | Chips                | IT / Finance / Consulting / Healthcare / E-comm / Mfg / Govt / Other | Career cohort             |
| 9   | Years of experience?        | Slider 0-25          | Default: 5                                                           | Career velocity           |
| 10  | Sleep per night?            | Slider 4-10hrs       | Step: 0.5hr                                                          | Health score              |
| 11  | Exercise days/week?         | Chips                | 0 / 1-2 / 3-4 / 5+                                                   | Health score              |
| 12  | How are you feeling lately? | Chips                | Overwhelmed / Managing / Okay / Thriving                             | Emotional pulse → framing |


**Q7 tooltip:** "Supporting family is strength. We adjust your benchmarks accordingly."
**After Q12:** "Crunching your numbers..." (2-second animation)

**Success metric:** >70% completion rate.

### Screen 3: Score Reveal

- Animated ring counter (0 → score, 1.5s ease-out)
- Three percentile bars (Financial, Career, Health) that fill on load
- Confidence badge ("Based on X,XXX people like you" or "Early estimate")
- "Your #1 Move" card (biggest opportunity from lowest-scoring pillar)
- Expandable "How we calculate this" (data sources + sample sizes)

**Adaptive framing by user state:**


| State                  | Copy                                                             |
| ---------------------- | ---------------------------------------------------------------- |
| First-time, low score  | "Here's where you are. Here's your biggest lever. Let's start."  |
| First-time, high score | "You're ahead of most peers your age. Here's how to stay there." |
| Overwhelmed (Q12)      | "One small step this week. No pressure. You're making progress." |


**Success metric:** >80% scroll past fold to see #1 Move card.

### Screen 4: Action Plan + Phone Capture

Three cards (Finance / Career / Health), each with:

- One risk flag (red)
- One win (green)
- One specific action with "Do This" CTA

ActiveMatch section: one fitness recommendation + one free alternative.

Phone capture (AFTER value delivered):

- "Save your score. Get better every Monday."
- Phone input (+91 pre-filled) → OTP
- "Skip for now" option (small text)

**Success metric:** >25% enter phone number.

### Screen 5: Share Mechanic

- "Share an insight, not your score."
- 2-3 pre-generated insight cards relevant to user's weakest pillar
- WhatsApp share button (primary), Copy Link (secondary)
- Cards show benchmark insights, NEVER personal scores

**Example cards:**

1. "67% of techies aged 25-30 in Bengaluru don't have term insurance. Do you?"
2. "The median savings rate for your age: 11%. Enough to retire? Not close."
3. "Engineers at services companies earn 31% less by Year 7. Check your trajectory."

**Success metric:** >15% share at least one card.

---

## PART 3: SCORING ENGINE

### Financial Score (35% of composite)


| Input          | Option                                    | Points |
| -------------- | ----------------------------------------- | ------ |
| Savings rate   | 0%=5, <5%=5, 5-10%=15, 10-20%=28, 20%+=48 | /48    |
| Term insurance | No=0, Not Sure=5, Yes=22                  | /22    |
| EMI burden     | 40%+=0, 20-40%=8, <20%=16, None=22        | /22    |


Max raw: 92 → Normalize to 0-100.
**Family support (Q7):** If Yes, percentile benchmarked against family-supporting sub-cohort only.

### Career Score (30% of composite)

- Salary Percentile (80 pts): Lookup in `industry × city × YoE × company_type` table → percentile → 20 + (percentile × 0.6)
- Career Velocity (20 pts): Salary band vs. expected for YoE → Behind=5, On Track=12, Ahead=20

### Health Score (20% of composite)


| Input    | Option                                 | Points |
| -------- | -------------------------------------- | ------ |
| Sleep    | <5hrs=5, 5-6=12, 6-7=22, 7-8=34, 8+=42 | /42    |
| Exercise | 0 days=5, 1-2=15, 3-4=30, 5+=42        | /42    |


Max raw: 84 → Normalize to 0-100.

### Emotional Pulse (15% — modifier)

Doesn't add points. Adjusts recommendation tone + pillar weights:

- Overwhelmed: Financial 0.40, Career 0.25, Health 0.35
- Managing/Okay: Standard weights
- Thriving: Financial 0.35, Career 0.35, Health 0.30

### Combined Formula

```
LifeScore = (Financial × weight_f) + (Career × weight_c) + (Health × weight_h)
```

Where weights shift based on emotional state.

---

## PART 4: TECH STACK


| Layer               | Technology                                     | Cost at Launch                        |
| ------------------- | ---------------------------------------------- | ------------------------------------- |
| Frontend (web)      | Next.js 15 + TypeScript + Tailwind + shadcn/ui | $0 (Vercel free)                      |
| Backend             | Next.js API Routes + Supabase Edge Functions   | $0                                    |
| Database            | PostgreSQL via Supabase                        | $0 (free tier)                        |
| Auth                | Supabase Auth + MSG91 (OTP)                    | ~$5/mo                                |
| Client-side scoring | Pure TypeScript in Web Worker                  | $0                                    |
| AI (Monday Brief)   | **Google Gemini API (gemini-2.0-flash)**       | $0 (free tier: 15 RPM, 1M tokens/day) |
| Analytics           | PostHog Cloud (free tier)                      | $0                                    |
| Payments            | Razorpay (when needed)                         | 2% per txn                            |
| Email               | Resend (free tier: 3K/mo)                      | $0                                    |
| Push notifications  | Firebase Cloud Messaging                       | $0                                    |
| OG image generation | Vercel OG (Satori)                             | $0                                    |
| Error tracking      | Sentry (free tier)                             | $0                                    |
| CI/CD               | GitHub Actions                                 | $0                                    |


**Total monthly cost at launch: ~$7/month.**

### Why Gemini Over Claude/OpenAI

- Free tier is extremely generous (1M tokens/day, 15 RPM on Flash)
- Gemini 2.0 Flash is fast, cheap, and high-quality for structured text generation
- For Monday Briefs (~300 tokens output each), the free tier supports **3,000+ briefs/day** — enough through 100K users on weekly briefs
- No API cost until significant scale; then Gemini's paid tier ($0.075/1M input tokens) is the cheapest option
- Fallback: switch to self-hosted Llama at 1M+ users if needed

---

## PART 5: 6-WEEK ENGINEERING SPRINT

**Sprint starts: Saturday, March 28, 2026**


| Week                        | CTO Builds                                                                                                                                                                                                                                                           | CEO Builds/Does                                                                                                                                                                                                                                         |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Week 1** (Mar 28 - Apr 3) | Supabase project + full DB schema + RLS. Country Config system (India as config #1). Scoring engine (all 3 pillars + emotional modifier, pure TypeScript). Salary lookup table (7,500 data points). GitHub repo + CI/CD → Vercel. Unit tests for every scoring path. | Next.js project scaffold. Design system (colors, fonts, spacing). Quiz component system (slider, chips, dropdown — all config-driven). Progress bar + auto-advance animation. Landing page copy finalized. Action library (50 actions, ~17 per pillar). |
| **Week 2** (Apr 4-10)       | Web Worker wrapper for scoring engine. Client-side scoring integration (quiz → Worker → result). API routes: `/api/config/[country]`, `/api/auth/otp`, `/api/auth/verify`. Seed benchmark data for 10 Indian cities. PostHog project + event schema definition.      | Landing page build. Score display screen (animated ring, percentile bars, confidence badges, expandable methodology). Action plan screen (3 cards + ActiveMatch). Quiz → Web Worker → Score flow integration. Share card copy (10-15 variants).         |
| **Week 3** (Apr 11-17)      | Supabase Auth integration (phone OTP via MSG91). User creation + score persistence. Adaptive framing engine. Returning user score history API. Privacy consent tracking. RLS testing.                                                                                | Privacy promise UI. Phone OTP flow (after score reveal). Returning user dashboard (score history). Adaptive framing UI (conditional copy/tone). Life Event selector (basic). All animations polished.                                                   |
| **Week 4** (Apr 18-24)      | Monday Brief pipeline: Supabase Edge Function (cron) + template engine + Gemini Flash for personal insight. Brief delivery (in-app + email via Resend). OG image endpoint (`/api/og` via Satori). Share mechanic API. Action tracking (recommended → completed).     | Monday Brief UI (in-app card). WhatsApp share flow (insight card → deep link). OG share card template (JSX → Satori). Mood tracking in Monday Brief. "How we calculate this" expandable sections.                                                       |
| **Week 5** (Apr 25 - May 1) | PostHog full funnel instrumentation. Performance optimization (API <200ms). DB query optimization. Error handling for all edge cases. Sentry setup. Rate limiting. Load test (k6, 100 concurrent).                                                                   | PostHog client-side events. Lighthouse audit (target >90 mobile). Responsive testing (5 Android devices). Error states (no data, offline, network fail). Code splitting + image optimization.                                                           |
| **Week 6** (May 2-8)        | 25-person beta: monitor errors, DB, scoring accuracy. Fix backend bugs. Score rubric calibration ("does it feel true?"). Security audit. DNS + SSL + production deploy. Ops runbook.                                                                                 | 25-person beta: sit with users, record every reaction. Fix UI bugs. Final polish (micro-interactions, loading skeletons). Soft launch prep (Reddit posts, LinkedIn content, social cards).                                                              |


**End of Week 6 deliverable:** Product live at vyve.app. 25 beta users validated. All critical bugs fixed.

---

## PART 6: PRE-LAUNCH MARKETING (Weeks 1-4, parallel with build)

CEO owns all marketing until hire #2 (Growth Marketer, Month 3).

### Week 1: "The Shock Data"


| Day | Content                                                                                                                                                                            | Channel             |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| Mon | "Only 24% of Indians are financially literate. But India's IT professionals spend 1.5x the global average on upskilling. We're educated — but not in the things that matter most." | LinkedIn (personal) |
| Wed | "The vicious cycle nobody talks about: financial stress → poor sleep → lower productivity → slower career → worse health. We're building something to break it."                   | LinkedIn + Twitter  |
| Fri | "We're building Vyve. Looking for 50 beta testers — IT professionals in BLR/MUM/PUN/HYD. DM me."                                                                                   | LinkedIn + Twitter  |


### Week 2: "Career Truth Bombs"


| Day | Content                                                                                                                       | Channel  |
| --- | ----------------------------------------------------------------------------------------------------------------------------- | -------- |
| Mon | "Services company engineers earn 31% less by Year 7 vs. product company peers. Same skills. Different ceiling."               | LinkedIn |
| Wed | "67% of IT professionals haven't negotiated in 18+ months — while market rates moved up 18%. Cost of not asking: Rs.2-4 LPA." | LinkedIn |
| Fri | Reddit r/developersIndia: "Analyzing salary data — patterns about when engineers hit earning ceilings by company type."       | Reddit   |


### Week 3: "The Connection"


| Day | Content                                                                                                                          | Channel   |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Mon | "55% of Indian tech professionals sleep past midnight. Sleep deprivation doesn't just wreck health — it drops productivity 23%." | LinkedIn  |
| Wed | Instagram carousel: "The invisible loop: How your money problems become career problems become health problems"                  | Instagram |
| Fri | Reddit r/IndiaInvestments: "I've been researching savings rates among 25-35 year old techies. Some surprising data."             | Reddit    |


### Week 4: "The Countdown"


| Day | Content                                                                                                       | Channel          |
| --- | ------------------------------------------------------------------------------------------------------------- | ---------------- |
| Mon | "5 days until Vyve opens. 12 questions. 2 minutes. Your real score across money, career, health — vs. peers." | All channels     |
| Thu | "How we built the scoring engine" — technical deep-dive. Transparent. Trust-building.                         | LinkedIn Article |
| Fri | **LAUNCH DAY**                                                                                                | All channels     |


### Waitlist Page (Live from Day 1)

- `vyve.app` → single page with headline, subhead, email/WhatsApp capture
- "X people are waiting" counter (real, even if starting at 0)
- Built on Vercel + Next.js. Cost: Rs.0.

---

## PART 7: LAUNCH WEEK (End of Week 6 — ~May 8, 2026)


| Day | Action                                                                                                                                | Channel                   | Target            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ----------------- |
| Mon | Founder post: "Today we're opening Vyve. 12 questions. 2.5 minutes. Free. No sign-up."                                                | LinkedIn + Twitter        | 150 completions   |
| Tue | r/developersIndia: "I built a tool that benchmarks your salary, savings, health against 14,000+ data points. Free. Feedback welcome." | Reddit                    | 100 completions   |
| Wed | r/IndiaInvestments: "Free financial health score benchmarked against Indian peers. Curious if it feels accurate."                     | Reddit                    | 100 completions   |
| Thu | First WhatsApp insight cards spread organically from beta users.                                                                      | WhatsApp                  | 50 organic shares |
| Fri | Instagram reel: real reaction video of someone seeing their score.                                                                    | Instagram                 | 50 completions    |
| Sat | Founder posts "What I learned from 500 people taking the Vyve quiz" with 3-4 aggregate stats.                                         | Twitter thread + LinkedIn | 50 completions    |


**Target: 500 quiz completions in launch week.**

---

## PART 8: GROWTH STRATEGY — 0 to 10,000 Users

### The Core Loop

```
Surprising Score → Insight Share Card → Friend Takes Quiz → Surprising Score → ...
```

### Growth Channels (Ranked)


| Channel       | Strategy                                                                      | Cost |
| ------------- | ----------------------------------------------------------------------------- | ---- |
| **WhatsApp**  | Insight cards (not scores). Curiosity hook.                                   | Rs.0 |
| **LinkedIn**  | Founder posts 3-4x/week. Benchmark data as content.                           | Rs.0 |
| **Reddit**    | r/IndiaInvestments + r/developersIndia. Genuine value, not promo.             | Rs.0 |
| **Instagram** | Myth-busting reels: "Your FD lost you money last year." 3x/week.              | Rs.0 |
| **Twitter/X** | Salary benchmark threads. Career velocity data.                               | Rs.0 |
| **SEO**       | Blog: "Salary Benchmarks 2026", "Savings Rate by Age India", "CTC vs In-Hand" | Rs.0 |
| **Referral**  | Month 2: invite friend → both get score history unlock for 30 days.           | Rs.0 |


### 5 Content Pillars

1. **"Where Do You Stand?"** — benchmark data + question. 2x/week LinkedIn.
2. **"The Money Myth"** — myth-busting. 2x/week Instagram.
3. **"The Career Ceiling"** — career data insights. 1x/week LinkedIn.
4. **"Monday Morning Insight"** — weekly nugget aligned with Monday Brief. Every Monday.
5. **"Life in Numbers"** — monthly deep-dive report. Blog + LinkedIn Article.

### The Share Card

```
┌───────────────────────────────────────┐
│  [Vyve logo — small, top-left]        │
│                                       │
│  "Did you know?"                      │
│                                       │
│  67% of techies aged 25-30           │
│  in Bengaluru don't have             │
│  term insurance.                      │
│                                       │
│  ───────────────────────              │
│  Where do you stand?                  │
│  2 minutes. Free. No sign-up.        │
│  vyve.app/check                       │
└───────────────────────────────────────┘
```

- 1200×630px (WhatsApp/LinkedIn OG standard)
- Deep indigo background. White text. Amber accent for CTA.
- **NEVER shows:** user's score, salary, or any personal data.

---

## PART 9: THE 3 NUMBERS THAT MATTER

After 90 days (by ~June 25, 2026):


| Metric                   | Target             | Kill Threshold                           |
| ------------------------ | ------------------ | ---------------------------------------- |
| **Quiz completion rate** | >70%               | <50% → quiz is broken                    |
| **WhatsApp share rate**  | >15% of completers | <5% → insight isn't surprising enough    |
| **Day 7 return rate**    | >30%               | <15% → product is a novelty, not a habit |


**Bonus:** "Did this feel true?" from beta → >80% yes. If <60%, stop everything. Fix the scoring engine.

---

## PART 10: BUDGET

### Monthly Spend


| Item                                            | Cost             |
| ----------------------------------------------- | ---------------- |
| Infrastructure (Vercel + Supabase + services)   | Rs.600 (~$7)     |
| MSG91 SMS (OTP)                                 | Rs.500           |
| Domain (vyve.app)                               | Rs.70/mo         |
| Canva Pro                                       | Rs.500           |
| Freelance designer (logo + brand kit, one-time) | Rs.10,000        |
| Content production reserve                      | Rs.15,000        |
| Emergency/experiments                           | Rs.23,330        |
| **Total**                                       | **Rs.50,000/mo** |


### What We Get For Free


| Service                  | Free Tier                                          |
| ------------------------ | -------------------------------------------------- |
| Vercel hosting           | 100GB bandwidth                                    |
| Supabase                 | 500MB DB, 50K auth users, 500K edge function calls |
| Gemini Flash API         | 1M tokens/day (enough for 3,000+ briefs/day)       |
| PostHog                  | 1M events/month                                    |
| Resend                   | 3,000 emails/month                                 |
| Firebase Cloud Messaging | Unlimited push                                     |
| Sentry                   | 5K errors/month                                    |
| GitHub Actions           | 2,000 minutes/month                                |


**Total infrastructure at launch: the cost of one chai per day.**

---

## PART 11: HIRING PLAN


| #   | Role                   | When                  | Why                                  | Budget                         |
| --- | ---------------------- | --------------------- | ------------------------------------ | ------------------------------ |
| 1   | **Data Scientist**     | Month 2 (after angel) | Scoring accuracy IS the product.     | Rs.12-18 LPA + 0.5-1% equity   |
| 2   | **Growth Marketer**    | Month 3               | Unlocks founder's time from content. | Rs.10-15 LPA + 0.3-0.5% equity |
| 3   | **Frontend Developer** | Month 3-4             | React Native mobile app.             | Rs.12-18 LPA + 0.3-0.5% equity |


---

## PART 12: FUNDRAISING


| Round            | When                   | Amount      | What We Show                                                          |
| ---------------- | ---------------------- | ----------- | --------------------------------------------------------------------- |
| **Angel**        | Month 2-3 (~June 2026) | Rs.1-2 Cr   | Working product. 500+ users. >70% quiz completion. Early share rates. |
| **Seed**         | Month 6-9              | Rs.4-8 Cr   | 25K+ users. D7 >35%. Monday Brief engagement. Marketplace revenue.    |
| **Pre-Series A** | Month 12-15            | Rs.10-15 Cr | 100K+ users. 4%+ conversion. Rs.50L+ ARR. UK research started.        |


**Target investors:** Titan Capital, First Cheque (Angel) → Better Capital, India Quotient (Seed) → Elevation, Accel India (Series A)

---

## PART 13: DATABASE SCHEMA (Key Tables)

```sql
users          (id, phone, country_code, city, age, subscription_tier, created_at)
quiz_responses (id, user_id, country_code, answers JSONB, completed_at)
scores         (id, user_id, quiz_response_id, financial_score, career_score,
                health_score, composite_score, cohort_key, cohort_size, confidence)
actions        (id, user_id, action_key, pillar, title, status, recommended_at, completed_at)
country_configs(country_code, quiz_schema JSONB, scoring_weights JSONB, action_library JSONB,
                pricing JSONB, cultural_framing JSONB)
benchmarks     (id, country_code, pillar, cohort_key, metric, value, sample_size, data_source)
monday_briefs  (id, user_id, week_number, score_change, brief_body, delivered_at, opened_at)
```

Country Config is JSONB — adding a new country = inserting one row. Zero code changes.

---

## PART 14: KEY ARCHITECTURAL DECISIONS


| Decision                  | Choice                                        | Rationale                                                 |
| ------------------------- | --------------------------------------------- | --------------------------------------------------------- |
| Client-side scoring       | Pure TypeScript in Web Worker                 | Trust architecture. "Your data never leaves your device." |
| Country Config system     | JSONB in Supabase, config-driven quiz/scoring | Adding a country = 6-8 weeks of config, not a rewrite.    |
| GDPR-first architecture   | Build for strictest standard from Day 1       | If GDPR-compliant, compliant everywhere.                  |
| Range inputs only         | Never ask for exact salary/savings            | 90% accuracy, 10x completion rate, zero PII liability.    |
| Monorepo                  | Single Next.js project, no microservices      | 2 engineers. One codebase. One deploy.                    |
| AI: Gemini Flash          | Free tier for briefs, paid tier at scale      | Generous free tier covers us through 100K users.          |
| No code forks per country | Feature flags + country config                | The moment we fork, the cost advantage dies.              |


---

## PART 15: RISKS & MITIGATIONS


| Risk                               | Severity | Mitigation (Next 90 Days)                                                                               |
| ---------------------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| **Score doesn't feel true**        | CRITICAL | Validate with 50+ real people before launch. "Did this feel true?" >80% or stop.                        |
| **One-time novelty, no retention** | CRITICAL | Monday Brief must be live before public launch. If D7 <15%, pause growth, fix retention.                |
| **Privacy backlash**               | HIGH     | Client-side scoring. Three-line promise. Range inputs. No data leaves device without opt-in.            |
| **Self-reported data inaccuracy**  | HIGH     | Range chips reduce dishonesty. Confidence levels show data quality honestly. AA integration at Month 9. |
| **Competitor copies**              | MEDIUM   | Speed. Data flywheel compounds. Integration thesis is hard for single-domain incumbents.                |


---

## CALENDAR SUMMARY


| Date         | Milestone                                                             |
| ------------ | --------------------------------------------------------------------- |
| **Mar 28**   | Sprint starts. Supabase + Next.js scaffold. Scoring engine begins.    |
| **Apr 10**   | Quiz + Score screen functional. Client-side scoring working.          |
| **Apr 17**   | Auth + persistence. Adaptive framing. Returning user dashboard.       |
| **Apr 24**   | Monday Brief pipeline. Share mechanic. OG cards.                      |
| **May 1**    | Analytics. Performance. Load testing. Error handling.                 |
| **May 8**    | 25-person beta. "Did this feel true?" validation.                     |
| **May 12**   | Fix beta feedback. Production deploy.                                 |
| **May 15**   | **SOFT LAUNCH.** First 500 users.                                     |
| **Jun 15**   | 2,000+ users. Share rate measured. D7 retention measured.             |
| **Jun 25**   | **90-day checkpoint.** 3 metrics evaluated. Go/no-go on acceleration. |
| **Jul 2026** | Angel raise. Hire #1 (Data Scientist).                                |
| **Sep 2026** | 10K users. Hire #2 + #3. Marketplace revenue.                         |
| **Dec 2026** | Seed raise. 50K users. React Native app.                              |
| **Jun 2027** | 150K users. UK market research. Pre-Series A.                         |


---

**The MVP takes 6 weeks. India takes 18 months. The world takes a decade. The moat takes a generation.**

**Sprint starts Saturday. Let's build.**

*— Vyve Founding Team, March 24, 2026*