"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionId } from "@/lib/session";

export function ComingSoonClient({
  params,
}: {
  params: {
    actionKey?: string;
    title?: string;
    pillar?: "financial" | "career" | "health";
  };
}) {
  const router = useRouter();
  const actionKey = params.actionKey ?? "unknown_action";
  const actionTitle = params.title ?? "This action";
  const pillar = params.pillar ?? "financial";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const heading = decodeURIComponent(actionTitle);

  function validateInputs() {
    const nextErrors: { name?: string; email?: string; phone?: string } = {};
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || cleanName.length < 2) {
      nextErrors.name = "Please enter your full name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    const phoneDigits = cleanPhone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      nextErrors.phone = "Please enter a valid phone number.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateInputs()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/actions/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: getSessionId(),
          action_key: actionKey,
          action_title: heading,
          pillar,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to save interest");
      setSubmitted(true);
    } catch {
      setError("Could not save your interest right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-lg mx-auto">
      <div className="rounded-3xl border border-gray-200 bg-white/90 backdrop-blur p-6 shadow-xl">
        <p className="text-xs uppercase tracking-wider text-vyve-amber font-semibold mb-2">
          Coming soon
        </p>
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">{heading}</h1>
        <p className="text-gray-600 mb-6">
          We are building this action right now. Share your details and we will notify you first when it goes live.
        </p>

        {submitted ? (
          <div className="space-y-4">
            <p className="text-emerald-600 font-medium">Thanks. You are on the early-access list.</p>
            <button
              onClick={() => router.back()}
              className="w-full py-3 rounded-2xl bg-vyve-indigo text-white font-semibold"
            >
              Back to actions
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
            >
              Go to main page
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white"
            />
            {fieldErrors.name && <p className="text-sm text-vyve-rose">{fieldErrors.name}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white"
            />
            {fieldErrors.email && <p className="text-sm text-vyve-rose">{fieldErrors.email}</p>}
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white"
            />
            {fieldErrors.phone && <p className="text-sm text-vyve-rose">{fieldErrors.phone}</p>}
            {error && <p className="text-sm text-vyve-rose">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-vyve-indigo to-vyve-indigo-light text-white font-semibold disabled:opacity-70"
            >
              {loading ? "Saving..." : "Notify Me"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
            >
              Skip for now
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
