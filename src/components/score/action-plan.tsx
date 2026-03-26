"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Heart, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import type { QuizAnswers, ScoreResult } from "@/types/quiz";
import { getActionsForUser, type Action } from "@/data/actions-library";
import { track } from "@/lib/analytics/events";
import { useRouter } from "next/navigation";

interface Props {
  answers: QuizAnswers;
  result: ScoreResult;
  onContinue: () => void;
}

const PILLAR_CONFIG = {
  financial: { label: "Financial Health", icon: DollarSign, color: "#10b981", bg: "bg-emerald-50" },
  career: { label: "Career Trajectory", icon: TrendingUp, color: "#3b82f6", bg: "bg-blue-50" },
  health: { label: "Wellness", icon: Heart, color: "#f43f5e", bg: "bg-rose-50" },
};

export function ActionPlan({ answers, result, onContinue }: Props) {
  const router = useRouter();
  const actions = getActionsForUser(answers as unknown as Record<string, unknown>);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-display font-bold text-gray-900">
          Your Priority Actions
        </h1>
        <p className="text-gray-500 mt-1">
          Three pillars. One action each. Start with {result.lowest_pillar}.
        </p>
      </motion.div>

      <div className="space-y-6">
        {(["financial", "career", "health"] as const).map((pillar, idx) => {
          const config = PILLAR_CONFIG[pillar];
          const pillarActions = actions[pillar];
          const Icon = config.icon;

          return (
            <motion.div
              key={pillar}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-lg ${config.bg}`}>
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <h3 className="font-semibold text-gray-900">{config.label}</h3>
              </div>

              <div className="space-y-3">
                {pillarActions.risk && (
                  <ActionCard action={pillarActions.risk} variant="risk" onOpenComingSoon={(action) => {
                    const title = encodeURIComponent(action.title);
                    router.push(`/coming-soon?actionKey=${action.key}&pillar=${action.pillar}&title=${title}`);
                  }} />
                )}
                {pillarActions.win && (
                  <ActionCard action={pillarActions.win} variant="win" onOpenComingSoon={(action) => {
                    const title = encodeURIComponent(action.title);
                    router.push(`/coming-soon?actionKey=${action.key}&pillar=${action.pillar}&title=${title}`);
                  }} />
                )}
                {pillarActions.action && (
                  <ActionCard action={pillarActions.action} variant="action" onOpenComingSoon={(action) => {
                    const title = encodeURIComponent(action.title);
                    router.push(`/coming-soon?actionKey=${action.key}&pillar=${action.pillar}&title=${title}`);
                  }} />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => {
          track.actionPlanViewed();
          onContinue();
        }}
        className="w-full py-4 bg-vyve-indigo text-white rounded-2xl font-semibold text-lg
          hover:bg-vyve-indigo-light transition-colors cursor-pointer mt-8"
      >
        Save & Share Your Insights
      </motion.button>
    </div>
  );
}

function ActionCard({
  action,
  variant,
  onOpenComingSoon,
}: {
  action: Action;
  variant: "risk" | "win" | "action";
  onOpenComingSoon: (action: Action) => void;
}) {
  const variantStyles = {
    risk: { icon: <AlertTriangle className="w-4 h-4 text-red-500" />, border: "border-l-red-400" },
    win: { icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, border: "border-l-emerald-400" },
    action: { icon: <ArrowRight className="w-4 h-4 text-vyve-amber" />, border: "border-l-amber-400" },
  };

  const style = variantStyles[variant];

  return (
    <button
      onClick={() => {
        track.actionClicked(action.pillar, action.key);
        onOpenComingSoon(action);
      }}
      className={`w-full text-left p-3 rounded-lg border-l-4 ${style.border} bg-gray-50
        hover:bg-gray-100 transition-colors cursor-pointer`}
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5">{style.icon}</span>
        <div>
          <p className="font-medium text-gray-800 text-sm">{action.title}</p>
          <p className="text-xs text-gray-500 mt-1">{action.description}</p>
          {action.cta && (
            <span className="inline-block mt-2 text-xs font-semibold text-vyve-indigo">
              {action.cta} →
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
