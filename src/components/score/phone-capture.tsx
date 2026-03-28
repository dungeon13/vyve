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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-[var(--pad-x)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--glass)]">
            <Phone className="h-7 w-7 text-[var(--teal)]" aria-hidden />
          </div>
          <h2 className="font-display text-2xl font-semibold text-[var(--text)]">Save your score</h2>
          <p className="mt-2 text-[15px] text-[var(--text2)]">
            Get better every Monday. Track your progress over time.
          </p>
        </div>

        {step === "phone" && (
          <div className="space-y-4">
            <p className="flex items-center justify-center gap-2 text-center text-[13px] text-[var(--text2)]">
              <MessageCircle className="h-4 w-4 shrink-0 text-[#25D366]" aria-hidden />
              We&apos;ll send a 6-digit code to this number on{" "}
              <span className="font-semibold text-[var(--text)]">WhatsApp</span>.
            </p>
            <div className="flex overflow-hidden rounded-xl border-2 border-[var(--border)] transition-colors focus-within:border-[var(--teal)]">
              <span className="border-r border-[var(--border)] bg-[var(--bg3)] px-4 py-3 font-medium text-[var(--text3)]">
                +91
              </span>
              <input
                type="tel"
                placeholder="WhatsApp number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="min-h-[48px] flex-1 bg-[var(--bg2)] px-4 py-3 text-base text-[var(--text)] outline-none placeholder:text-[var(--text3)]"
                maxLength={10}
                autoComplete="tel-national"
              />
            </div>
            {error && (
              <div className="space-y-2">
                <p className="whitespace-pre-wrap break-words text-sm text-[var(--coral)]">{error}</p>
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="min-h-[44px] w-full rounded-xl border border-[var(--border)] py-2 font-semibold text-[var(--text2)] transition-colors hover:bg-[var(--glass)]"
                >
                  Try again
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-[16px] bg-[var(--teal)] py-3.5 font-display text-[16px] font-semibold text-black transition-opacity hover:opacity-95 disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send code on WhatsApp"}
              {!loading && <ArrowRight className="h-4 w-4" aria-hidden />}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            {inboundHint ? (
              <p className="whitespace-pre-wrap rounded-xl border border-[var(--gold)] bg-[rgba(240,165,0,0.08)] px-3 py-3 text-center text-[13px] text-[var(--text)]">
                {inboundHint}
              </p>
            ) : (
              <p className="text-center text-[13px] text-[var(--text2)]">
                Enter the code we sent to your WhatsApp.
              </p>
            )}
            <input
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full rounded-xl border-2 border-[var(--border)] bg-[var(--bg2)] px-4 py-3 text-center font-mono text-2xl tracking-widest text-[var(--text)] outline-none transition-colors focus:border-[var(--teal)]"
              maxLength={6}
            />
            {error && (
              <div className="space-y-2">
                <p className="whitespace-pre-wrap break-words text-sm text-[var(--coral)]">{error}</p>
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="min-h-[44px] w-full rounded-xl border border-[var(--border)] py-2 font-semibold text-[var(--text2)] transition-colors hover:bg-[var(--glass)]"
                >
                  Try again
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full min-h-[48px] cursor-pointer rounded-[16px] bg-[var(--teal)] py-3.5 font-display text-[16px] font-semibold text-black transition-opacity hover:opacity-95 disabled:opacity-50"
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
              className="w-full cursor-pointer text-sm text-[var(--text3)] transition-colors hover:text-[var(--text2)]"
            >
              Use a different number
            </button>
          </div>
        )}

        {step === "done" && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-[var(--green)]" aria-hidden />
            <p className="text-lg font-semibold text-[var(--text)]">Score saved!</p>
            <p className="mt-1 text-[var(--text2)]">See you Monday morning.</p>
          </motion.div>
        )}

        {(step === "phone" || step === "otp") && (
          <button
            type="button"
            onClick={() => {
              track.authSkipped();
              onSkip();
            }}
            className="relative z-10 mt-4 w-full min-h-[44px] cursor-pointer rounded-xl py-3 text-[14px] font-medium text-[var(--text2)] transition-colors hover:bg-[var(--glass)] hover:text-[var(--text)]"
          >
            Skip for now
          </button>
        )}
      </motion.div>
    </div>
  );
}
