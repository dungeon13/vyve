# Data sourcing, “agents,” scoring, and LLM UX (Vyve)

This document aligns engineering with the LifeScore / Vyve vision docs (including `LifeScore_CoFounder_v3.pdf`, `LifeScore_Enhanced_Product_Document_v4.md`, `Global_Product_Document_v5.md`) while staying on the right side of law, platform terms, and user trust.

---

## 1. Why we do not run autonomous “scrapers” on third‑party sites

Product docs name many platforms (e.g. AmbitionBox, 6figr, Glassdoor, Levels.fyi, JobStreet, social networks). **Crawling or scraping those sites without explicit permission usually violates their Terms of Service** and can create legal and reputational risk. It also produces brittle data (layout changes break parsers) and weak audit trails for a trust-first product.

**Instead, Vyve uses a tiered sourcing model:**

| Tier | What it is | Examples (from product docs) |
|------|------------|------------------------------|
| **A — Official / open data** | Public statistics, regulators, national surveys | RBI, MOSPI, BPS, OJK, Bank Indonesia, ONS, NHS public stats |
| **B — Licensed or API partners** | Contractual use, clear rights | Salary APIs, aggregated labour market data, employer-reported benchmarks where licensed |
| **C — First-party / user-consented** | Quiz answers, opt-in uploads, future bank/HR integrations | LifeScore user base (“data flywheel”), future Plaid / AA / HRMS with consent |
| **D — Research-assisted curation** | Humans + tools that only use **allowed** sources | Analysts importing **published** reports, CSVs from partners, manual entry into `vyve_benchmarks` |

**“Agents” in a responsible sense** means: orchestrated **research and ETL jobs** that (1) pull from **allowed** endpoints, (2) normalize into `vyve_benchmarks` / `vyve_country_configs`, (3) log provenance (`data_source`, `sample_size`, `updated_at`). They are not permissionless scrapers against LinkedIn, AmbitionBox, etc.

---

## 2. How scoring should evolve as real data lands

Today, V1 uses **seed tables + quiz cohort keys** (`salary-benchmarks.ts`, scoring engine). As Tier A–C data grows:

1. **Replace static seeds** with rows in `vyve_benchmarks` (per `country_code`, `pillar`, `cohort_key`, `metric`).
2. **Recompute percentiles** from stored distributions or pre-aggregated quantiles (not from raw PII).
3. **Confidence badges** (from v4 spec): tie UI copy to `sample_size` and cohort coverage (e.g. “Early estimate” → “Based on X people like you”).
4. **Family-adjusted and emotional-weighting** logic stays in code; **baselines** move from config/DB, not from one-off scrapes.

**Practical pipeline:** scheduled job (e.g. weekly) reads approved datasets → writes `vyve_benchmarks` → optional shadow mode compares old vs new scores before flipping a feature flag.

---

## 3. LLM capabilities and how they improve UX (without replacing the product)

Gemini (and similar models) are strong at **language, personalization, and synthesis**; they are weak as **authoritative numeric truth** without grounded data. Recommended split:

| Use case | LLM role | Guardrails |
|----------|----------|------------|
| **Monday Brief** | Turn structured inputs (scores, deltas, recommended actions) into a short, warm note | Fixed max length; no invented statistics; template + structured JSON in, prose out |
| **Adaptive framing** | Choose among pre-approved tone variants (overwhelmed vs thriving) | Only select from a curated set; never fabricate peer percentages |
| **Insight card copy** | Variations on **benchmark-backed** lines | Every claim must cite a `vyve_benchmarks` row or fixed copy ID |
| **“How we calculate this”** | Simplify methodology text | Must match official methodology; human-reviewed |
| **Support / FAQ** | Answer product questions | No medical/legal/financial advice as “personal advice”; escalate disclaimers |
| **On-device scoring** | Not used | Financial/career/health **numbers** stay deterministic (TypeScript) for trust |

**Enhancements to prioritize after V1:** RAG over **your own** docs + benchmark tables; A/B test brief tone via PostHog; multilingual summaries once India English PMF is solid.

---

## 4. WhatsApp OTP (implementation note)

Login codes are generated and verified on Vyve’s server, stored hashed in `vyve_otp_codes`, and delivered via **Meta WhatsApp Cloud API**. This avoids Supabase SMS provider setup.

**Production checklist:** Meta may require an **approved authentication or utility template** for outbound messages at scale; test numbers work in dev. Set `OTP_SECRET`, `WA_ACCESS_TOKEN`, and `WA_PHONE_NUMBER_ID` in Railway.

---

## 5. Summary

- **Data:** Prefer open/regulatory, licensed APIs, and first-party consent—not stealth scraping of career/salary sites.
- **Scoring:** Move from seed files to **`vyve_benchmarks`** as data arrives; keep client-side deterministic math.
- **LLM:** Use for **personalized language** and workflows grounded in **your** data and policies, not for making up benchmarks.

This keeps Vyve aligned with the PDF’s ambition (credible benchmarks, transparency, flywheel) while building a defensible, trustworthy data stack.
