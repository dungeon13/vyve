"use client";

import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics/events";
import { useEffect } from "react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { GlassCard } from "@/components/ui/glass-card";

const TICKER_INSIGHTS = [
  "54% of tech professionals your age save less than 10%",
  "The median IT salary at 5 years: ₹75K–1.2L in Bengaluru",
  "67% of engineers aged 25–30 don't have term insurance",
  "Services company engineers earn 31% less by Year 7",
  "55% of Indian tech professionals sleep past midnight",
  "Only 22% of professionals aged 25–35 save more than 20%",
  "Sleep deprivation drops productivity by 23%",
];

interface Props {
  onStart: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

export function Hero({ onStart }: Props) {
  useEffect(() => {
    track.landingViewed();
  }, []);

  const handleStart = () => {
    track.ctaClicked();
    onStart();
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <motion.div
        className="ls-orb-teal pointer-events-none absolute -right-24 -top-24"
        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.75, 0.55] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="ls-orb-gold pointer-events-none absolute -bottom-32 -left-24"
        animate={{ scale: [1, 1.1, 1], opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-[var(--pad-x)] pb-6 pt-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full max-w-[480px] text-center"
        >
          <motion.p variants={item} className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">
            LifeScore
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-4 font-display text-[clamp(32px,9vw,44px)] font-semibold italic leading-[1.15] tracking-[-0.02em] text-[var(--text)]"
          >
            Know exactly where you stand in India
          </motion.h1>

          <motion.p variants={item} className="mt-4 text-[15px] leading-relaxed text-[var(--text2)]">
            Your money, career, and health — benchmarked against{" "}
            <span className="font-semibold text-[var(--text)]">real peers</span> your age, city, and income.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
            aria-label="Three pillars"
          >
            {[
              { label: "Financial Score", className: "pillar-finance border border-[rgba(99,102,241,0.35)]" },
              { label: "Career Score", className: "pillar-career border border-[rgba(240,165,0,0.35)]" },
              { label: "Health Score", className: "pillar-health border border-[rgba(0,212,170,0.35)]" },
            ].map((pill) => (
              <span
                key={pill.label}
                className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-3 py-2 font-mono-label text-[10px] font-semibold uppercase tracking-wider text-[var(--text2)] ${pill.className}`}
              >
                {pill.label}
              </span>
            ))}
          </motion.div>

          <motion.div variants={item} className="mt-10 w-full">
            <PrimaryButton onClick={handleStart} aria-label="Get my LifeScore" className="inline-flex w-full items-center justify-center gap-2">
              Get My LifeScore
              <ArrowRight className="h-5 w-5" aria-hidden />
            </PrimaryButton>
            <p className="mt-3 font-mono-label text-[10px] uppercase tracking-[0.15em] text-[var(--text3)]">
              No sign-up needed · 2 minutes · 100% free
            </p>
          </motion.div>

          <motion.div variants={item} className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <GlassCard className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-3 py-2 text-[12px] text-[var(--text2)]">
              <Shield className="h-4 w-4 shrink-0 text-[var(--teal)]" aria-hidden />
              Private by default
            </GlassCard>
            <GlassCard className="flex min-h-[44px] items-center justify-center rounded-2xl px-3 py-2 text-[12px] text-[var(--text2)]">
              No signup required
            </GlassCard>
            <GlassCard className="flex min-h-[44px] items-center justify-center rounded-2xl px-3 py-2 text-[12px] text-[var(--text2)]">
              Delete anytime
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10 border-t border-[var(--border)] bg-[var(--bg2)]/80 py-4 backdrop-blur-md">
        <div className="overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
            aria-hidden
          >
            {[...TICKER_INSIGHTS, ...TICKER_INSIGHTS].map((insight, i) => (
              <span key={i} className="inline-block px-8 text-[13px] font-medium text-[var(--text3)]">
                {insight}
                <span className="mx-8 text-[var(--border2)]">·</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
