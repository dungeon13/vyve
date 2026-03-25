"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, ArrowRight, CheckCircle, MessageCircle } from "lucide-react";
import { track } from "@/lib/analytics/events";
import { formatUserFacingError, parseApiErrorResponse } from "@/lib/api/parse-error-response";

interface Props {
  onVerified: (phone: string) => void;
  onSkip: () => void;
}

const VYVE_USER_ID_KEY = "vyve_user_id";

export function PhoneCapture({ onVerified, onSkip }: Props) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "done">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  /** Shown when Meta blocks proactive send until user messages the business first */
  const [inboundHint, setInboundHint] = useState("");

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
      const data = await parseApiErrorResponse(res);
      if (!res.ok) {
        setError(formatUserFacingError(data));
        return;
      }
      setInboundHint(
        data.delivery === "after_inbound_message" && typeof data.message === "string"
          ? data.message
          : ""
      );
      setStep("otp");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(
        msg === "Failed to fetch"
          ? "Network error — check your connection or try again."
          : `Could not reach server: ${msg}`
      );
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
      const data = await parseApiErrorResponse(res);
      if (!res.ok) {
        setError(formatUserFacingError(data));
        return;
      }
      if (typeof data.user_id === "string") {
        try {
          localStorage.setItem(VYVE_USER_ID_KEY, data.user_id);
        } catch {
          /* ignore quota / private mode */
        }
      }
      track.authCompleted();
      setStep("done");
      setTimeout(() => onVerified(`+91${phone}`), 1000);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg === "Failed to fetch" ? "Network error. Try again." : msg);
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
            <p className="text-sm text-center text-gray-600 flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-600 shrink-0" />
              We&apos;ll send a 6-digit code to this number on{" "}
              <span className="font-semibold text-gray-800">WhatsApp</span>.
            </p>
            <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-vyve-indigo transition-colors">
              <span className="px-4 py-3 bg-gray-50 text-gray-500 font-medium border-r border-gray-200">
                +91
              </span>
              <input
                type="tel"
                placeholder="WhatsApp number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="flex-1 px-4 py-3 text-base outline-none"
                maxLength={10}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 whitespace-pre-wrap break-words">{error}</p>
            )}
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3.5 bg-vyve-indigo text-white rounded-xl font-semibold
                hover:bg-vyve-indigo-light transition-colors disabled:opacity-50 cursor-pointer
                flex items-center justify-center gap-2"
            >
              {loading ? "Sending…" : "Send code on WhatsApp"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            {inboundHint ? (
              <p className="text-sm text-center text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-3 whitespace-pre-wrap">
                {inboundHint}
              </p>
            ) : (
              <p className="text-sm text-center text-gray-500">
                Enter the code we sent to your WhatsApp.
              </p>
            )}
            <input
              type="text"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-2xl
                tracking-widest font-mono focus:border-vyve-indigo outline-none transition-colors"
              maxLength={6}
            />
            {error && (
              <p className="text-sm text-red-600 whitespace-pre-wrap break-words">{error}</p>
            )}
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-3.5 bg-vyve-indigo text-white rounded-xl font-semibold
                hover:bg-vyve-indigo-light transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Verifying…" : "Verify"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
                setInboundHint("");
              }}
              className="w-full text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Use a different number
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
