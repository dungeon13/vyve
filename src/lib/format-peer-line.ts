import type { QuizAnswers } from "@/types/quiz";

const SALARY_DISPLAY: Record<string, string> = {
  "<30K": "under ₹30K",
  "30-50K": "₹30–50K",
  "50-75K": "₹50–75K",
  "75K-1.2L": "₹75K–1.2L",
  "1.2-2L": "₹1.2–2L",
  "2L+": "₹2L+",
};

/**
 * Human-readable cohort line for score UI (Indian context).
 * Does not change scoring — display only.
 */
export function formatPeerContextLine(answers: Partial<QuizAnswers>): string {
  const age = typeof answers.age === "number" ? answers.age : 28;
  const city = answers.city?.trim() || "your city";
  const industry = answers.industry?.trim() || "your industry";
  const salaryKey = answers.salary_range ?? "50-75K";
  const salary = SALARY_DISPLAY[salaryKey] ?? salaryKey;

  return `Based on ${age}-year-olds in ${city} earning ${salary} in ${industry}:`;
}
