"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Heart } from "lucide-react";
import type { QuizAnswers, ScoreResult } from "@/types/quiz";
import { getActionsForUser, type Action } from "@/data/actions-library";
import { track } from "@/lib/analytics/events";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ActionCard } from "@/components/ui/action-card";

interface Props {
  answers: QuizAnswers;
  result: ScoreResult;
  onContinue: () => void;
}

const PILLAR_CONFIG = {
  financial: {
    label: "Financial",
    icon: DollarSign,
    cardClass: "pillar-finance border-[rgba(99,102,241,0.35)]",
    accent: "var(--violet)",
  },
  career: {
    label: "Career",
    icon: TrendingUp,
    cardClass: "pillar-career border-[rgba(240,165,0,0.35)]",
    accent: "var(--gold)",
  },
  health: {
    label: "Health",
    icon: Heart,
    cardClass: "pillar-health border-[rgba(0,212,170,0.35)]",
    accent: "var(--teal)",
  },
} as const;

export function ActionPlan({ answers, result, onContinue }: Props) {
  const router = useRouter();
  const actions = getActionsForUser(answers as unknown as Record<string, unknown>);

  const dual =
    result.lowest_pillar === "financial"
      ? {
          title: "Negotiate first, then SIP",
          body: "Your salary gap may cost more than spending leaks. A dual move lifts finance + career.",
          fin: "+18 fin pts",
          car: "+8 car pts",
        }
      : result.lowest_pillar === "career"
        ? {
            title: "Upskill + protect downside",
            body: "One course + one insurance check — career velocity with a safety net.",
            fin: "+6 fin pts",
            car: "+14 car pts",
          }
        : {
            title: "Sleep block + SIP nudge",
            body: "Fix recovery and automate ₹5K — health and wealth together.",
            fin: "+10 fin pts",
            car: "+5 car pts",
          };

  const openComingSoon = (action: Action) => {
    const title = encodeURIComponent(action.title);
    router.push(`/coming-soon?actionKey=${action.key}&pillar=${action.pillar}&title=${title}`);
  };

  return (
    <div className="mx-auto min-h-screen max-w-[480px] px-[var(--pad-x)] pb-12 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text3)]">
          Elevate
        </p>
        <h1 className="font-display text-[clamp(26px,7vw,32px)] font-semibold tracking-[-0.02em] text-[var(--text)]">
          Your action plan
        </h1>
        <p className="mt-2 text-[15px] text-[var(--text2)]">
          Three pillars. Start with {result.lowest_pillar}.
        </p>
      </motion.div>

      <div className="space-y-5">
        {(["financial", "career", "health"] as const).map((pillar, idx) => {
          const config = PILLAR_CONFIG[pillar];
          const pillarActions = actions[pillar];
          const Icon = config.icon;

          return (
            <motion.div
              key={pillar}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-[var(--radius-card)] border p-5 ${config.cardClass}`}
            >
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--glass)]">
                  <Icon className="h-5 w-5" style={{ color: config.accent }} aria-hidden />
                </div>
                <h3 className="font-display text-[19px] font-semibold text-[var(--text)]">{config.label}</h3>
              </div>

              <div className="space-y-3">
                {pillarActions.risk && (
                  <ActionCard
                    action={pillarActions.risk}
                    variant="risk"
                    onActivate={(action) => {
                      track.actionClicked(action.pillar, action.key);
                      openComingSoon(action);
                    }}
                  />
                )}
                {pillarActions.win && (
                  <ActionCard
                    action={pillarActions.win}
                    variant="win"
                    onActivate={(action) => {
                      track.actionClicked(action.pillar, action.key);
                      openComingSoon(action);
                    }}
                  />
                )}
                {pillarActions.action && (
                  <ActionCard
                    action={pillarActions.action}
                    variant="action"
                    onActivate={(action) => {
                      track.actionClicked(action.pillar, action.key);
                      openComingSoon(action);
                    }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="relative mt-8 overflow-hidden rounded-[var(--radius-card)] p-[1px]"
        style={{
          background: "linear-gradient(135deg, #818cf8, var(--teal))",
        }}
      >
        <div className="rounded-[calc(var(--radius-card)-1px)] bg-[var(--bg2)] p-5">
          <p className="inline-flex items-center gap-1 font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">
            <span aria-hidden>✨</span> Dual elevation
          </p>
          <p className="mt-2 font-display text-[18px] font-semibold text-[var(--text)]">{dual.title}</p>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--text2)]">{dual.body}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-[rgba(99,102,241,0.15)] px-3 py-1 font-mono-label text-[10px] font-semibold text-[var(--violet)]">
              {dual.fin}
            </span>
            <span className="rounded-full bg-[rgba(240,165,0,0.12)] px-3 py-1 font-mono-label text-[10px] font-semibold text-[var(--gold)]">
              {dual.car}
            </span>
          </div>
        </div>
      </motion.div>

      <PrimaryButton
        className="mt-10"
        onClick={() => {
          track.actionPlanViewed();
          onContinue();
        }}
        aria-label="Save and share insights"
      >
        Save &amp; share your insights
      </PrimaryButton>
    </div>
  );
}
