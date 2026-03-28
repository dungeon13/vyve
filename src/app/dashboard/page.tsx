"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuiz } from "@/components/quiz/quiz-context";
import { ScoreRequiredGate } from "@/components/gates/score-required-gate";
import { DashboardPageSkeleton } from "@/components/shells/page-skeletons";
import { HeroScoreCard } from "@/components/dashboard/hero-score-card";
import { WeeklyMoveCard } from "@/components/dashboard/weekly-move-card";
import { PillarCard } from "@/components/ui/pillar-card";
import { RedFlagItem } from "@/components/ui/red-flag-item";
import { SectionLabel } from "@/components/ui/section-label";
import { getActionsForUser } from "@/data/actions-library";

function clampPct(n: number): number {
  return Math.min(99, Math.max(1, Math.round(n)));
}

export default function DashboardPage() {
  return (
    <ScoreRequiredGate skeleton={<DashboardPageSkeleton />}>
      <DashboardInner />
    </ScoreRequiredGate>
  );
}

function DashboardInner() {
  const router = useRouter();
  const { scoreResult, answers } = useQuiz();

  if (!scoreResult) return null;

  const pct = clampPct(50 + Math.floor((scoreResult.composite_score - 50) * 0.6));
  const city = typeof answers.city === "string" ? answers.city : "India";
  const actions = getActionsForUser(answers as unknown as Record<string, unknown>);
  const lp = scoreResult.lowest_pillar;
  const bucket = actions[lp];
  const weekly = bucket.action ?? bucket.risk ?? bucket.win;
  const weeklyTitle = weekly?.title ?? "Pick one move in your weakest pillar this week.";
  const weeklyDesc = weekly?.description;

  const flags: { text: string; pillar: "financial" | "career" | "health" }[] = [];
  (["financial", "career", "health"] as const).forEach((p) => {
    const r = actions[p].risk;
    if (r) flags.push({ text: r.title, pillar: p });
  });

  const initials = city.slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className="mx-auto max-w-[480px] px-[var(--pad-x)] pb-8 pt-8"
    >
      <header className="mb-8 flex items-center justify-between gap-3">
        <div>
          <SectionLabel>Home</SectionLabel>
          <h1 className="font-display text-[28px] font-semibold tracking-[-0.02em] text-[var(--text)]">
            Hello, friend
          </h1>
          <p className="mt-1 text-[14px] text-[var(--text2)]">{city}</p>
        </div>
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--teal)] to-[var(--violet)] font-display text-lg font-semibold text-black"
          aria-hidden
        >
          {initials}
        </div>
      </header>

      <HeroScoreCard
        score={scoreResult.composite_score}
        percentileLabel={`Better than ~${pct}% of peers in your cohort`}
      />

      <div className="mt-4 grid grid-cols-3 gap-2">
        <PillarCard
          pillar="financial"
          score={scoreResult.financial_score}
          delay={0}
          onClick={() => router.push("/drilldown/financial")}
        />
        <PillarCard
          pillar="career"
          score={scoreResult.career_score}
          delay={0.08}
          onClick={() => router.push("/drilldown/career")}
        />
        <PillarCard
          pillar="health"
          score={scoreResult.health_score}
          delay={0.16}
          onClick={() => router.push("/drilldown/health")}
        />
      </div>

      <div className="mt-6">
        <WeeklyMoveCard title={weeklyTitle} description={weeklyDesc} />
      </div>

      {flags.length > 0 && (
        <section className="mt-8" aria-label="Red flags">
          <SectionLabel className="mb-3 text-[var(--coral)]">Red flags</SectionLabel>
          <div className="space-y-2">
            {flags.map((f) => (
              <RedFlagItem key={f.text} onClick={() => router.push(`/drilldown/${f.pillar}`)}>
                {f.text}
              </RedFlagItem>
            ))}
          </div>
        </section>
      )}

      <Link
        href="/brief"
        prefetch
        className="mt-8 flex min-h-[48px] items-center justify-center rounded-[18px] border border-[var(--border2)] bg-[var(--glass)] font-display text-[15px] font-semibold text-[var(--text)] transition-colors hover:border-[var(--teal)]"
      >
        Your weekly brief
      </Link>
    </motion.div>
  );
}
