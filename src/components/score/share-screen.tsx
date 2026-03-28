"use client";

import { motion } from "framer-motion";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";
import { useState } from "react";
import type { ScoreResult, QuizAnswers } from "@/types/quiz";
import { track } from "@/lib/analytics/events";
import { PrimaryButton } from "@/components/ui/primary-button";
import { GlassCard } from "@/components/ui/glass-card";

interface Props {
  result: ScoreResult;
  answers: Partial<QuizAnswers>;
  onSaveScore: () => void;
  /** Skip saving phone / briefs — e.g. navigate to dashboard */
  onSkip?: () => void;
}

interface InsightCard {
  id: string;
  text: string;
  pillar: string;
}

function generateInsightCards(result: ScoreResult, answers: Partial<QuizAnswers>): InsightCard[] {
  const cards: InsightCard[] = [];
  const city = answers.city || "India";
  const age = answers.age || 28;
  const ageGroup = age < 25 ? "22-25" : age < 30 ? "25-30" : age < 35 ? "30-35" : "35+";

  if (result.financial_score < 50) {
    cards.push({
      id: "fin_insurance",
      text: `67% of techies aged ${ageGroup} in ${city} don't have term insurance. Do you?`,
      pillar: "financial",
    });
    cards.push({
      id: "fin_savings",
      text: `The median savings rate for your age: 11%. Enough to retire? Not close.`,
      pillar: "financial",
    });
  } else {
    cards.push({
      id: "fin_savings_good",
      text: `Only 22% of professionals aged ${ageGroup} save more than 20% of their salary. Are you one of them?`,
      pillar: "financial",
    });
  }

  cards.push({
    id: "career_ceiling",
    text: `Engineers at services companies earn 31% less by Year 7. Check your trajectory.`,
    pillar: "career",
  });

  if (result.health_score < 60) {
    cards.push({
      id: "health_sleep",
      text: `55% of Indian tech professionals sleep past midnight. Sleep deprivation drops productivity 23%.`,
      pillar: "health",
    });
  }

  return cards.slice(0, 3);
}

export function ShareScreen({ result, answers, onSaveScore, onSkip }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const cards = generateInsightCards(result, answers);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vyve.app";

  const handleWhatsAppShare = (card: InsightCard) => {
    track.shareWhatsappClicked(card.id);
    const text = `${card.text}\n\nWhere do you stand? 2 minutes. Free. No sign-up.\n${appUrl}/check`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async (card: InsightCard) => {
    track.shareLinkCopied(card.id);
    const text = `${card.text}\n\nCheck yours: ${appUrl}/check`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(card.id);
      setCopyError(null);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopyError("Could not copy automatically. Please long-press and copy this screen text.");
      setTimeout(() => setCopyError(null), 3000);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-[480px] px-[var(--pad-x)] py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <Share2 className="mx-auto mb-3 h-8 w-8 text-[var(--teal)]" aria-hidden />
        <h1 className="font-display text-[clamp(24px,6vw,28px)] font-semibold text-[var(--text)]">
          Share an insight, not your score
        </h1>
        <p className="mt-2 text-[15px] text-[var(--text2)]">
          Pick an insight card. Your score stays private.
        </p>
        {copyError && (
          <div className="mt-3 space-y-2">
            <p className="text-[13px] text-[var(--coral)]">{copyError}</p>
            <button
              type="button"
              onClick={() => setCopyError(null)}
              className="min-h-[44px] w-full max-w-xs rounded-[14px] border border-[var(--border)] py-2 font-semibold text-[var(--text2)] transition-colors hover:bg-[var(--glass)]"
            >
              Dismiss
            </button>
          </div>
        )}
      </motion.div>

      <div className="mb-8 space-y-4">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlassCard className="p-6">
              <p className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                Did you know?
              </p>
              <p className="mt-3 text-[16px] font-medium leading-snug text-[var(--text)]">{card.text}</p>
              <div className="mt-4 border-t border-[var(--border)] pt-3">
                <p className="font-mono-label text-[11px] text-[var(--text3)]">LifeScore · peer insight</p>
              </div>

              <div className="mt-4 flex gap-2">
                <motion.button
                  type="button"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleWhatsAppShare(card)}
                  className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-[14px] bg-[#25D366] font-display text-[14px] font-semibold text-black"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCopyLink(card)}
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] border border-[var(--border2)] bg-[var(--glass)] px-4 font-display text-[14px] font-semibold text-[var(--text)]"
                  aria-label="Copy text"
                >
                  {copiedId === card.id ? (
                    <Check className="h-4 w-4 text-[var(--green)]" aria-hidden />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden />
                  )}
                  {copiedId === card.id ? "Copied" : "Copy"}
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-4">
        <PrimaryButton onClick={onSaveScore} aria-label="Save score and get Monday briefs">
          Save my score &amp; get Monday briefs
        </PrimaryButton>
        <button
          type="button"
          onClick={() => {
            track.authSkipped();
            onSkip?.();
          }}
          className="w-full min-h-[44px] rounded-xl py-3 text-[14px] font-medium text-[var(--text2)] transition-colors hover:bg-[var(--glass)] hover:text-[var(--text)]"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}
