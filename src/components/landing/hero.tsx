"use client";

import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics/events";
import { useEffect, useRef } from "react";

const TICKER_INSIGHTS = [
  "54% of tech professionals your age save less than 10%",
  "The median IT salary at 5 years: Rs.75K-1.2L in Bengaluru",
  "67% of engineers aged 25-30 don't have term insurance",
  "Services company engineers earn 31% less by Year 7",
  "55% of Indian tech professionals sleep past midnight",
  "Only 22% of professionals aged 25-35 save more than 20%",
  "Sleep deprivation drops productivity by 23%",
];

interface Props {
  onStart: () => void;
}

export function Hero({ onStart }: Props) {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    track.landingViewed();
  }, []);

  const handleStart = () => {
    track.ctaClicked();
    onStart();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-lg"
        >
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-lg font-display font-bold tracking-widest text-vyve-indigo/60 uppercase">
              Vyve
            </h2>
          </motion.div>

          {/* Hero */}
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 leading-tight mb-4">
            Where do you{" "}
            <span className="text-vyve-indigo">really</span> stand?
          </h1>

          <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            Your money. Your career. Your health.
            <br />
            Compared to <span className="text-gray-700 font-semibold">real peers</span>.
            <br />
            <span className="text-gray-700">2 minutes. Free. No sign-up.</span>
          </p>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-vyve-indigo text-white 
              rounded-2xl font-semibold text-lg shadow-xl shadow-vyve-indigo/20
              hover:bg-vyve-indigo-light transition-colors cursor-pointer"
          >
            Check My Score — Free
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {/* Trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400"
          >
            <Shield className="w-4 h-4" />
            <span>Your data stays on your device. We never sell it. Delete everything in 2 taps.</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scrolling ticker */}
      <div className="bg-gray-50 border-t border-gray-100 py-4 overflow-hidden">
        <div ref={tickerRef} className="flex animate-ticker whitespace-nowrap">
          {[...TICKER_INSIGHTS, ...TICKER_INSIGHTS].map((insight, i) => (
            <span key={i} className="inline-block px-8 text-sm text-gray-500 font-medium">
              {insight}
              <span className="mx-8 text-gray-300">•</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
