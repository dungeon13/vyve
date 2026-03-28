"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useQuiz } from "@/components/quiz/quiz-context";
import { ScoreRequiredGate } from "@/components/gates/score-required-gate";
import { ProfilePageSkeleton } from "@/components/shells/page-skeletons";
import { SectionLabel } from "@/components/ui/section-label";
import { GlassCard } from "@/components/ui/glass-card";
import type { QuizAnswers } from "@/types/quiz";

function Row({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex min-h-[48px] items-center justify-between gap-3 py-2">
      <span className="text-[14px] text-[var(--text2)]">{label}</span>
      <span className="flex items-center gap-1 text-right font-medium text-[var(--text)]">
        {value}
        {href && <ChevronRight className="h-4 w-4 text-[var(--text3)]" aria-hidden />}
      </span>
    </div>
  );
  if (href) {
    return (
      <Link href={href} prefetch className="block rounded-xl transition-colors hover:bg-[var(--glass)]">
        {inner}
      </Link>
    );
  }
  return inner;
}

export default function ProfilePage() {
  return (
    <ScoreRequiredGate skeleton={<ProfilePageSkeleton />}>
      <ProfileInner />
    </ScoreRequiredGate>
  );
}

function ProfileInner() {
  const { scoreResult, answers } = useQuiz();

  if (!scoreResult) return null;

  const a = answers as Partial<QuizAnswers>;
  const city = typeof a.city === "string" ? a.city : "—";
  const industry = typeof a.industry === "string" ? a.industry : "—";
  const age = typeof a.age === "number" ? `${a.age}` : "—";
  const yoe = typeof a.experience_years === "number" ? `${a.experience_years} yrs` : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-[480px] px-[var(--pad-x)] pb-10 pt-8"
    >
      <SectionLabel>Profile</SectionLabel>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--violet)] to-[var(--teal)] font-display text-2xl font-bold text-black">
          {city.slice(0, 1) || "Y"}
        </div>
        <div>
          <h1 className="font-display text-[26px] font-semibold tracking-[-0.02em] text-[var(--text)]">You</h1>
          <p className="text-[14px] text-[var(--text2)]">
            {city} · {industry}
          </p>
          <p className="font-mono-label text-[11px] text-[var(--text3)]">
            Age {age} · {yoe}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2 text-center">
        {[
          { k: "Finance", v: scoreResult.financial_score },
          { k: "Career", v: scoreResult.career_score },
          { k: "Health", v: scoreResult.health_score },
        ].map((x) => (
          <GlassCard key={x.k} className="py-3">
            <p className="font-mono-label text-[9px] uppercase text-[var(--text3)]">{x.k}</p>
            <p className="font-display text-2xl font-bold text-[var(--text)]">{x.v}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-8 divide-y divide-[var(--border)] p-0 px-4">
        <p className="py-3 font-mono-label text-[10px] uppercase tracking-wider text-[var(--text3)]">
          Snapshot inputs
        </p>
        <Row label="City" value={city} />
        <Row label="Salary band" value={String(a.salary_range ?? "—")} />
        <Row label="Savings rate" value={String(a.savings_rate ?? "—")} />
        <Row label="Term insurance" value={String(a.term_insurance ?? "—")} />
        <Row label="EMI burden" value={String(a.emi_burden ?? "—")} />
        <Row label="Sleep (hrs)" value={String(a.sleep_hours ?? "—")} />
        <Row label="Exercise / week" value={String(a.exercise_days ?? "—")} />
      </GlassCard>

      <GlassCard className="mt-4 divide-y divide-[var(--border)] p-0 px-4">
        <p className="py-3 font-mono-label text-[10px] uppercase tracking-wider text-[var(--text3)]">
          Account
        </p>
        <Row label="Notifications" value="Coming soon" />
        <Row label="Privacy & data" value="In-app" />
        <Row label="Upgrade to Pro" value="Waitlist" />
        <Row label="Refer a friend" value="Share" href="/share" />
      </GlassCard>

      <p className="mt-8 text-center font-mono-label text-[10px] leading-relaxed text-[var(--text3)]">
        DPDP-aligned: you control what we store. Delete from device settings when available.
      </p>
    </motion.div>
  );
}
