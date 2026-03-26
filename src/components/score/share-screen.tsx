"use client";

import { motion } from "framer-motion";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";
import { useState } from "react";
import type { ScoreResult, QuizAnswers } from "@/types/quiz";
import { track } from "@/lib/analytics/events";

interface Props {
  result: ScoreResult;
  answers: Partial<QuizAnswers>;
  onSaveScore: () => void;
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

export function ShareScreen({ result, answers, onSaveScore }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const cards = generateInsightCards(result, answers);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vyve.app";

  const handleWhatsAppShare = (card: InsightCard) => {
    track.shareWhatsappClicked(card.id);
    const text = `${card.text}\n\nWhere do you stand? 2 minutes. Free. No sign-up.\n${appUrl}/check`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
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
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Share2 className="w-8 h-8 text-vyve-indigo mx-auto mb-3" />
        <h1 className="text-2xl font-display font-bold text-gray-900">
          Share an insight, not your score
        </h1>
        <p className="text-gray-500 mt-2">
          Pick an insight card to share with friends. Your score stays private.
        </p>
        {copyError && (
          <p className="mt-3 text-sm text-vyve-rose">{copyError}</p>
        )}
      </motion.div>

      <div className="space-y-4 mb-8">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-vyve-indigo via-vyve-indigo-light to-vyve-indigo rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-vyve-indigo/20"
          >
            <p className="text-xs text-vyve-amber font-semibold mb-2 uppercase tracking-wider">
              Did you know?
            </p>
            <p className="text-lg font-medium leading-snug mb-4">{card.text}</p>
            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
              <p className="text-sm text-white/60">
                Where do you stand? · vyve.app
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleWhatsAppShare(card)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500
                  rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                onClick={() => handleCopyLink(card)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/15
                  rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors cursor-pointer"
              >
                {copiedId === card.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copiedId === card.id ? "Copied" : "Copy"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <button
          onClick={onSaveScore}
          className="w-full py-4 bg-gradient-to-r from-vyve-indigo to-vyve-indigo-light text-white rounded-2xl font-semibold text-lg
            hover:shadow-xl hover:shadow-vyve-indigo/20 transition-all cursor-pointer"
        >
          Save My Score & Get Monday Briefs
        </button>
        <button
          onClick={() => track.authSkipped()}
          className="w-full py-3 text-gray-400 text-sm cursor-pointer hover:text-gray-600 transition-colors"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}
