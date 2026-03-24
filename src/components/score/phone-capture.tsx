"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, ArrowRight, CheckCircle } from "lucide-react";
import { track } from "@/lib/analytics/events";

interface Props {
  onVerified: (phone: string) => void;
  onSkip: () => void;
}

export function PhoneCapture({ onVerified, onSkip }: Props) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "done">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      setError("Enter a valid 10-digit number");
      return;
    }
    setLoading(true);
    setError("");
    track.phoneSubmitted();

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      setStep("otp");
    } catch {
      setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      setError("Enter a valid OTP");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phone}`, otp }),
      });
      if (!res.ok) throw new Error("Invalid OTP");
      track.authCompleted();
      setStep("done");
      setTimeout(() => onVerified(`+91${phone}`), 1000);
    } catch {
      setError("Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-vyve-indigo/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-7 h-7 text-vyve-indigo" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900">
            Save your score
          </h2>
          <p className="text-gray-500 mt-2">
            Get better every Monday. Track your progress over time.
          </p>
        </div>

        {step === "phone" && (
          <div className="space-y-4">
            <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-vyve-indigo transition-colors">
              <span className="px-4 py-3 bg-gray-50 text-gray-500 font-medium border-r border-gray-200">
                +91
              </span>
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="flex-1 px-4 py-3 text-base outline-none"
                maxLength={10}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3.5 bg-vyve-indigo text-white rounded-xl font-semibold
                hover:bg-vyve-indigo-light transition-colors disabled:opacity-50 cursor-pointer
                flex items-center justify-center gap-2"
            >
              {loading ? "Sending..." : "Send OTP"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-2xl
                tracking-widest font-mono focus:border-vyve-indigo outline-none transition-colors"
              maxLength={6}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-3.5 bg-vyve-indigo text-white rounded-xl font-semibold
                hover:bg-vyve-indigo-light transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        )}

        {step === "done" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900">Score saved!</p>
            <p className="text-gray-500 mt-1">See you Monday morning.</p>
          </motion.div>
        )}

        <button
          onClick={() => {
            track.authSkipped();
            onSkip();
          }}
          className="w-full mt-4 py-3 text-gray-400 text-sm cursor-pointer hover:text-gray-600 transition-colors"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}
