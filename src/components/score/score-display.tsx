"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScoreRing } from "./score-ring";
import { PercentileBar } from "./percentile-bar";
import { ChevronDown, ChevronUp, Shield, TrendingUp, Heart, DollarSign } from "lucide-react";
import type { ScoreResult, EmotionalState } from "@/types/quiz";
import { track } from "@/lib/analytics/events";

interface Props {
  result: ScoreResult;
  onContinue: () => void;
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

const PILLAR_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  financial: { label: "Financial Health", icon: <DollarSign className="w-5 h-5" />, color: "#10b981" },
  career: { label: "Career Trajectory", icon: <TrendingUp className="w-5 h-5" />, color: "#3b82f6" },
  health: { label: "Wellness", icon: <Heart className="w-5 h-5" />, color: "#f43f5e" },
};

const MOVE_TEXT: Record<string, string> = {
  financial: "Your biggest lever is financial. One fix here moves your whole score.",
  career: "Your career trajectory has the most room to grow. One move changes everything.",
  health: "Health is your weakest link right now. Fix sleep or exercise first.",
};

export function ScoreDisplay({ result, onContinue }: Props) {
  const [showMethodology, setShowMethodology] = useState(false);

  const scoreLevel = result.composite_score >= 60 ? "high" : "low";
  const message = FRAMING[result.emotional_state]?.[scoreLevel] ?? FRAMING.okay[scoreLevel];

  const handleMethodologyToggle = () => {
    if (!showMethodology) track.methodologyExpanded();
    setShowMethodology((prev) => !prev);
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Your Vyve Score
        </h1>
        <p className="text-gray-600">{message}</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex justify-center mb-10 rounded-3xl border border-gray-200 bg-white/85 backdrop-blur p-4 shadow-xl shadow-vyve-indigo/5"
      >
        <ScoreRing score={result.composite_score} size={220} label="Composite Score" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-2 justify-center mb-8"
      >
        <Shield className="w-4 h-4 text-vyve-amber" />
        <span className="text-sm text-gray-500">Early estimate — accuracy improves with more users</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="space-y-6 mb-10"
      >
        <PercentileBar
          label={PILLAR_LABELS.financial.label}
          score={result.financial_score}
          percentile={50 + Math.floor((result.financial_score - 50) * 0.6)}
          color={PILLAR_LABELS.financial.color}
          icon={PILLAR_LABELS.financial.icon}
        />
        <PercentileBar
          label={PILLAR_LABELS.career.label}
          score={result.career_score}
          percentile={50 + Math.floor((result.career_score - 50) * 0.6)}
          color={PILLAR_LABELS.career.color}
          icon={PILLAR_LABELS.career.icon}
        />
        <PercentileBar
          label={PILLAR_LABELS.health.label}
          score={result.health_score}
          percentile={50 + Math.floor((result.health_score - 50) * 0.6)}
          color={PILLAR_LABELS.health.color}
          icon={PILLAR_LABELS.health.icon}
        />
      </motion.div>

      {/* #1 Move Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-gradient-to-br from-vyve-indigo via-vyve-indigo-light to-vyve-indigo rounded-3xl p-6 text-white mb-8 shadow-xl shadow-vyve-indigo/20"
      >
        <p className="text-vyve-amber font-semibold text-sm mb-2">Your #1 Move</p>
        <p className="text-lg font-medium">
          {MOVE_TEXT[result.lowest_pillar]}
        </p>
      </motion.div>

      {/* Methodology */}
      <button
        onClick={handleMethodologyToggle}
        className="w-full flex items-center justify-between py-3 px-2 rounded-xl text-gray-500 hover:text-gray-700 
          hover:bg-white/60 transition-colors text-sm cursor-pointer"
      >
        <span>How we calculate this</span>
        {showMethodology ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showMethodology && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-sm text-gray-500 space-y-3 pb-6"
        >
          <p>
            <strong>Financial (35%):</strong> Based on savings rate, insurance coverage, and debt burden. 
            Family-supporting users are benchmarked against a separate sub-cohort.
          </p>
          <p>
            <strong>Career (30%):</strong> Salary percentile within your industry × city × experience cohort, 
            plus career velocity (actual vs. expected growth).
          </p>
          <p>
            <strong>Health (20%):</strong> Sleep duration and exercise frequency, weighted by clinical guidelines.
          </p>
          <p>
            <strong>Emotional Pulse (15%):</strong> Adjusts pillar weights — if you&apos;re overwhelmed, 
            we weight health and financial more heavily.
          </p>
          <p className="text-xs text-gray-400">
            All scoring happens on your device. Your raw answers never leave your browser.
          </p>
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={onContinue}
        className="w-full py-4 bg-gradient-to-r from-vyve-indigo to-vyve-indigo-light text-white rounded-2xl font-semibold text-lg
          hover:shadow-xl hover:shadow-vyve-indigo/20 transition-all cursor-pointer mt-4"
      >
        See My 3 Priority Actions
      </motion.button>
    </div>
  );
}
