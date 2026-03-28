"use client";

import { useMemo } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { useQuiz } from "@/components/quiz/quiz-context";
import { ScoreRequiredGate } from "@/components/gates/score-required-gate";
import { DrilldownPageSkeleton } from "@/components/shells/page-skeletons";
import { MatchCard, type MatchCardData } from "@/components/activematch/match-card";
import { BackButton } from "@/components/shared/back-button";
import { DrilldownHeader } from "@/components/shared/drilldown-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { PrimaryButton } from "@/components/ui/primary-button";
import { GlassCard } from "@/components/ui/glass-card";
import { PillarCTA } from "@/components/ui/pillar-cta";
import { getActionsForUser } from "@/data/actions-library";
import { formatPeerContextLine } from "@/lib/format-peer-line";
import type { ScoreResult } from "@/types/quiz";
import { Sparkles } from "lucide-react";

const EASE = [0.4, 0, 0.2, 1] as [number, number, number, number];

export default function DrilldownPage() {
  return (
    <ScoreRequiredGate skeleton={<DrilldownPageSkeleton />}>
      <DrilldownInner />
    </ScoreRequiredGate>
  );
}

const PILLARS = ["financial", "career", "health"] as const;
type Pillar = (typeof PILLARS)[number];

function isPillar(s: string): s is Pillar {
  return (PILLARS as readonly string[]).includes(s);
}

function statusFromPct(p: number): "critical" | "needs_work" | "good" {
  if (p < 35) return "critical";
  if (p < 65) return "needs_work";
  return "good";
}

function pctFromScore(score: number): number {
  return Math.min(99, Math.max(1, Math.round(50 + (score - 50) * 0.6)));
}

function driverPercentile(result: ScoreResult, pillar: Pillar, metric: string): number | undefined {
  return result.score_drivers?.find((d) => d.pillar === pillar && d.metric === metric)?.percentile;
}

function DrilldownInner() {
  const params = useParams();
  const router = useRouter();
  const { scoreResult, answers } = useQuiz();
  const raw = typeof params.pillar === "string" ? params.pillar : "";

  if (!isPillar(raw)) {
    notFound();
  }
  const pillar = raw;

  if (!scoreResult) {
    return null;
  }

  const peer = formatPeerContextLine(answers);
  const actions = getActionsForUser(answers as unknown as Record<string, unknown>);
  const oneMove = actions[pillar].action ?? actions[pillar].risk ?? actions[pillar].win;

  const score =
    pillar === "financial"
      ? scoreResult.financial_score
      : pillar === "career"
        ? scoreResult.career_score
        : scoreResult.health_score;

  const percentile = pctFromScore(score);

  const title =
    pillar === "financial" ? "Financial score" : pillar === "career" ? "Career score" : "Health & ActiveMatch";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="mx-auto max-w-[480px] px-[var(--pad-x)] pb-12 pt-6"
    >
      <BackButton href="/dashboard" />

      <DrilldownHeader
        eyebrow="Drilldown"
        title={title}
        subtitle={peer}
      />

      <GlassCard className="mb-6 p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono-label text-[10px] uppercase tracking-wider text-[var(--text3)]">Score</p>
            <p className="font-display text-[48px] font-bold leading-none tracking-[-0.03em] text-[var(--text)]">
              {score}
            </p>
          </div>
          <p className="font-mono-label text-right text-[11px] text-[var(--text2)]">
            ~{percentile}th percentile
            <br />
            vs cohort
          </p>
        </div>
        <div className="mt-4">
          <ProgressBar
            value={score}
            color={pillar === "financial" ? "#818cf8" : pillar === "career" ? "var(--gold)" : "var(--teal)"}
            delay={0}
          />
        </div>
      </GlassCard>

      {pillar === "financial" && <FinancialBody result={scoreResult} answers={answers} />}
      {pillar === "career" && <CareerBody result={scoreResult} answers={answers} />}
      {pillar === "health" && (
        <HealthBody city={typeof answers.city === "string" ? answers.city : "your city"} salaryKey={typeof answers.salary_range === "string" ? answers.salary_range : ""} />
      )}

      {oneMove && (
        <div className="pillar-career mt-8 rounded-[var(--radius-card)] border border-[rgba(240,165,0,0.35)] p-5">
          <p className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Your one move
          </p>
          <p className="mt-2 font-display text-[18px] font-semibold text-[var(--text)]">{oneMove.title}</p>
          <p className="mt-2 text-[14px] text-[var(--text2)]">{oneMove.description}</p>
          <PrimaryButton className="mt-4" onClick={() => router.push("/elevate")} aria-label="Open elevate">
            Open Elevate
          </PrimaryButton>
        </div>
      )}
    </motion.div>
  );
}

function FinancialBody({
  result,
  answers,
}: {
  result: ScoreResult;
  answers: Partial<import("@/types/quiz").QuizAnswers>;
}) {
  const rows = useMemo(() => {
    const insurancePct = driverPercentile(result, "financial", "term_insurance") ?? 40;
    const savingsPct = driverPercentile(result, "financial", "savings_rate") ?? 50;
    const emiPct = driverPercentile(result, "financial", "emi_burden") ?? 50;
    return [
      { label: "Term insurance", pct: insurancePct, hint: answers.term_insurance === "yes" ? "Covered" : "Gap vs peers" },
      { label: "Savings rate", pct: savingsPct, hint: "Vs cohort" },
      { label: "EMI burden", pct: emiPct, hint: "Debt headroom" },
      { label: "Emergency fund", pct: 45, hint: "Target 6 months expenses" },
      { label: "Investment mix", pct: 52, hint: "FD vs market-linked" },
    ];
  }, [result, answers.term_insurance]);

  return (
    <section className="space-y-3" aria-label="Financial breakdown">
      {rows.map((row) => (
        <GlassCard key={row.label} className="flex items-center justify-between gap-3 p-4">
          <div>
            <p className="font-display text-[15px] font-semibold text-[var(--text)]">{row.label}</p>
            <p className="font-mono-label text-[10px] text-[var(--text3)]">{row.hint}</p>
          </div>
          <StatusBadge status={statusFromPct(row.pct)} />
        </GlassCard>
      ))}
    </section>
  );
}

function CareerBody({
  result,
  answers,
}: {
  result: ScoreResult;
  answers: Partial<import("@/types/quiz").QuizAnswers>;
}) {
  const salaryPct = driverPercentile(result, "career", "salary_percentile_city_segment") ?? 50;
  const yoe = typeof answers.experience_years === "number" ? answers.experience_years : 5;

  return (
    <section className="space-y-6" aria-label="Career breakdown">
      <GlassCard className="p-5">
        <p className="font-mono-label text-[10px] uppercase tracking-wider text-[var(--text3)]">
          Salary vs cohort
        </p>
        <div className="mt-4 flex h-12 items-end gap-1">
          {[25, 50, 75].map((p, i) => (
            <div key={p} className="flex flex-1 flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-t-md bg-[var(--border2)]"
                initial={{ height: 0 }}
                animate={{ height: `${12 + i * 14}px` }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
              />
              <span className="font-mono-label text-[9px] text-[var(--text3)]">{p}th</span>
            </div>
          ))}
        </div>
        <p className="mt-3 font-mono-label text-[11px] text-[var(--text2)]">
          You sit near the {salaryPct}th percentile for {yoe} YOE in your cohort.
        </p>
      </GlassCard>

      <div className="grid grid-cols-2 gap-2">
        {[
          { k: "Velocity", v: "On track" },
          { k: "Salary gap", v: "Vs median" },
          { k: "Last raise", v: "Self-report next" },
          { k: "Lifetime gap", v: "Estimate" },
        ].map((box) => (
          <GlassCard key={box.k} className="p-3">
            <p className="font-mono-label text-[10px] text-[var(--text3)]">{box.k}</p>
            <p className="mt-1 font-display text-[16px] font-semibold text-[var(--text)]">{box.v}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-5">
        <p className="font-display text-[17px] font-semibold text-[var(--text)]">Skills gap</p>
        <p className="mt-1 text-[13px] text-[var(--text2)]">
          Bars show common gaps vs next level for your track — personalised scripts ship in Elevate.
        </p>
        <div className="mt-4 space-y-2">
          {["Stakeholder mgmt", "System design", "Negotiation"].map((s, i) => (
            <div key={s}>
              <div className="mb-1 flex justify-between font-mono-label text-[10px] text-[var(--text3)]">
                <span>{s}</span>
                <span>{40 + i * 15}%</span>
              </div>
              <ProgressBar value={40 + i * 15} color="var(--gold)" delay={0.1 * i} />
            </div>
          ))}
        </div>
      </GlassCard>

      <PillarCTA pillar="career" aria-label="Generate negotiation script">
        Generate negotiation script
      </PillarCTA>
    </section>
  );
}

function HealthBody({ city, salaryKey }: { city: string; salaryKey: string }) {
  const budget =
    salaryKey.includes("2L") || salaryKey === "1.2-2L"
      ? "₹5K–15K / month"
      : salaryKey.includes("75K") || salaryKey.includes("50-75K")
        ? "₹2K–8K / month"
        : "Free – ₹5K / month";

  const matches: MatchCardData[] = [
    {
      name: "Cult.fit — nearest centre",
      distance: "2.4 km",
      financialFit: "₹2,999/mo",
      healthTag: "Strength + cardio",
      score: 88,
    },
    {
      name: "Municipal sports complex",
      distance: "4.1 km",
      financialFit: "Free",
      healthTag: "Badminton slots",
      score: 76,
    },
    {
      name: "Local yoga studio",
      distance: "1.2 km",
      financialFit: "₹3,500/mo",
      healthTag: "Stress + mobility",
      score: 71,
    },
  ];

  return (
    <section className="space-y-6" aria-label="Health and ActiveMatch">
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Sleep", status: "needs_work" as const },
          { label: "Exercise", status: "good" as const },
          { label: "Stress", status: "needs_work" as const },
          { label: "BMI", status: "good" as const },
        ].map((m) => (
          <GlassCard key={m.label} className="p-3">
            <p className="font-mono-label text-[10px] text-[var(--text3)]">{m.label}</p>
            <div className="mt-2">
              <StatusBadge status={m.status} />
            </div>
          </GlassCard>
        ))}
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--teal)]" aria-hidden />
          <h2 className="font-display text-[20px] font-semibold text-[var(--text)]">Best activities for you</h2>
        </div>
        <p className="font-mono-label text-[11px] text-[var(--text2)]">
          {city} · budget {budget}
        </p>

        <div className="mt-4 space-y-3">
          {matches.map((m, idx) => (
            <MatchCard key={m.name} data={m} highlighted={idx === 0} />
          ))}
        </div>

        <PillarCTA pillar="health" className="mt-4" aria-label="Explore all matches">
          Explore all matches
        </PillarCTA>
      </div>
    </section>
  );
}
