"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MessageCircle, Link2, Copy, Check, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { ScoreRing } from "./score-ring";
import { PercentileBar } from "./percentile-bar";
import { PrimaryButton } from "@/components/ui/primary-button";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionLabel } from "@/components/ui/section-label";
import { useQuiz } from "@/components/quiz/quiz-context";
import type { ScoreResult, EmotionalState } from "@/types/quiz";
import { track } from "@/lib/analytics/events";
import { formatPeerContextLine } from "@/lib/format-peer-line";
import { DollarSign, TrendingUp, Heart } from "lucide-react";

interface Props {
  result: ScoreResult;
  onContinueToDashboard: () => void;
  onContinueToActions: () => void;
}

const FRAMING: Record<EmotionalState, Record<string, string>> = {
  overwhelmed: {
    low: "One small step this week. No pressure. You're making progress.",
    high: "You're doing better than you think. Let's build on that.",
  },
  managing: {
    low: "Here's where you are. Here's your biggest lever. Let's start.",
    high: "Solid foundation. Small tweaks can make a big difference.",
  },
  okay: {
    low: "Here's where you are. Here's your biggest lever. Let's start.",
    high: "You're ahead of most peers your age. Here's how to stay there.",
  },
  thriving: {
    low: "Good energy. Let's channel it into your weakest area.",
    high: "You're ahead of most peers your age. Here's how to stay there.",
  },
};

const PILLAR_META: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  financial: {
    label: "Financial",
    icon: <DollarSign className="h-5 w-5" aria-hidden />,
    color: "#818cf8",
  },
  career: {
    label: "Career",
    icon: <TrendingUp className="h-5 w-5" aria-hidden />,
    color: "var(--gold)",
  },
  health: {
    label: "Health",
    icon: <Heart className="h-5 w-5" aria-hidden />,
    color: "var(--teal)",
  },
};

const MOVE_TEXT: Record<string, string> = {
  financial: "Your biggest lever is financial. One fix here moves your whole score.",
  career: "Your career trajectory has the most room to grow. One move changes everything.",
  health: "Health is your weakest link right now. Fix sleep or exercise first.",
};

function clampPct(n: number): number {
  return Math.min(99, Math.max(1, Math.round(n)));
}

export function ScoreDisplay({
  result,
  onContinueToDashboard,
  onContinueToActions,
}: Props) {
  const router = useRouter();
  const { answers } = useQuiz();
  const [showMethodology, setShowMethodology] = useState(false);
  const [copied, setCopied] = useState(false);

  const scoreLevel = result.composite_score >= 60 ? "high" : "low";
  const message = FRAMING[result.emotional_state]?.[scoreLevel] ?? FRAMING.okay[scoreLevel];
  const peerLine = formatPeerContextLine(answers);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const shareBody = `${peerLine}\n\nMy LifeScore: ${result.composite_score}/100. Where do you stand? ${appUrl}`;

  const handleWhatsApp = () => {
    track.shareWhatsappClicked("score_reveal");
    const url = `https://wa.me/?text=${encodeURIComponent(shareBody)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    track.shareLinkCopied("score_reveal");
    try {
      await navigator.clipboard.writeText(shareBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleMethodologyToggle = () => {
    if (!showMethodology) track.methodologyExpanded();
    setShowMethodology((prev) => !prev);
  };

  const openDrilldown = (pillar: "financial" | "career" | "health") => {
    router.push(`/drilldown/${pillar}`);
  };

  return (
    <div className="mx-auto min-h-screen max-w-[480px] px-[var(--pad-x)] py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="mb-6 text-center"
      >
        <SectionLabel className="justify-center">Your snapshot</SectionLabel>
        <h1 className="font-display text-[clamp(26px,7vw,34px)] font-semibold leading-tight tracking-[-0.02em] text-[var(--text)]">
          Your LifeScore
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--text2)]">{message}</p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-4 text-center font-mono-label text-[11px] leading-snug text-[var(--text3)]"
      >
        {peerLine}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8 flex justify-center"
      >
        <div className="elevated-card p-6">
          <ScoreRing
            score={result.composite_score}
            size={220}
            label="Composite"
            color="var(--teal)"
          />
        </div>
      </motion.div>

      <div className="mb-6 flex items-center justify-center gap-2 text-[var(--text3)]">
        <Shield className="h-4 w-4 text-[var(--gold)]" aria-hidden />
        <span className="text-center text-[12px] leading-snug">
          Early estimate — accuracy improves with more users
        </span>
      </div>

      <div className="mb-8 space-y-4">
        <PercentileBar
          label={PILLAR_META.financial.label}
          score={result.financial_score}
          percentile={clampPct(50 + Math.floor((result.financial_score - 50) * 0.6))}
          color={PILLAR_META.financial.color}
          icon={PILLAR_META.financial.icon}
          onPress={() => openDrilldown("financial")}
        />
        <PercentileBar
          label={PILLAR_META.career.label}
          score={result.career_score}
          percentile={clampPct(50 + Math.floor((result.career_score - 50) * 0.6))}
          color={PILLAR_META.career.color}
          icon={PILLAR_META.career.icon}
          onPress={() => openDrilldown("career")}
        />
        <PercentileBar
          label={PILLAR_META.health.label}
          score={result.health_score}
          percentile={clampPct(50 + Math.floor((result.health_score - 50) * 0.6))}
          color={PILLAR_META.health.color}
          icon={PILLAR_META.health.icon}
          onPress={() => openDrilldown("health")}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="pillar-career mb-8 rounded-[var(--radius-card)] border border-[var(--border)] p-5"
      >
        <p className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
          Biggest opportunity
        </p>
        <p className="mt-2 font-display text-[18px] font-semibold leading-snug text-[var(--text)]">
          {MOVE_TEXT[result.lowest_pillar]}
        </p>
      </motion.div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleWhatsApp}
          aria-label="Share score on WhatsApp"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-[16px] bg-[#25D366] font-display text-[15px] font-semibold text-black"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          WhatsApp
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          aria-label="Copy score link"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-[16px] border border-[var(--border2)] bg-[var(--glass)] font-display text-[15px] font-semibold text-[var(--text)]"
        >
          {copied ? <Check className="h-5 w-5 text-[var(--green)]" /> : <Copy className="h-5 w-5" />}
          {copied ? "Copied" : "Copy"}
        </motion.button>
      </div>

      <PrimaryButton
        onClick={onContinueToDashboard}
        className="mb-3"
        aria-label="Open your dashboard"
      >
        Open my dashboard
      </PrimaryButton>

      <button
        type="button"
        onClick={onContinueToActions}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[16px] py-3 font-medium text-[15px] text-[var(--text2)] transition-colors hover:text-[var(--text)]"
        aria-label="See three priority actions and share"
      >
        <Link2 className="h-4 w-4" aria-hidden />
        Priority actions &amp; share
      </button>

      <GlassCard className="mt-8">
        <button
          type="button"
          onClick={handleMethodologyToggle}
          className="flex min-h-[48px] w-full items-center justify-between gap-2 rounded-xl px-1 py-2 text-left text-[13px] text-[var(--text2)] transition-colors hover:bg-[var(--glass)] hover:text-[var(--text)]"
          aria-expanded={showMethodology}
        >
          <span>How we calculate this</span>
          {showMethodology ? (
            <ChevronUp className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
          )}
        </button>

        {showMethodology && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3 border-t border-[var(--border)] pt-4 text-[13px] leading-relaxed text-[var(--text2)]"
          >
            <p>
              <strong className="text-[var(--text)]">Financial (35%):</strong> Savings rate, insurance
              coverage, and debt burden. Family-supporting users are benchmarked against a separate
              sub-cohort.
            </p>
            <p>
              <strong className="text-[var(--text)]">Career (30%):</strong> Salary percentile within your
              industry × city × experience cohort, plus career velocity.
            </p>
            <p>
              <strong className="text-[var(--text)]">Health (20%):</strong> Sleep and exercise, weighted by
              clinical guidelines.
            </p>
            <p>
              <strong className="text-[var(--text)]">Emotional pulse (15%):</strong> Adjusts pillar weights —
              if you&apos;re overwhelmed, we weight health and financial more heavily.
            </p>
            <p className="font-mono-label text-[10px] text-[var(--text3)]">
              Scoring runs on your device. Raw answers are not sent to our servers for calculation.
            </p>
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
}
