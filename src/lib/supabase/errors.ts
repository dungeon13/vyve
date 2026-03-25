import type { PostgrestError } from "@supabase/supabase-js";

export function hintForMissingVyveOtpTable(err: PostgrestError | null | undefined): string | undefined {
  if (!err) return undefined;
  const msg = (err.message || "").toLowerCase();
  const code = err.code;
  if (
    code === "42P01" ||
    code === "PGRST205" ||
    msg.includes("does not exist") ||
    msg.includes("schema cache") ||
    msg.includes("could not find the table")
  ) {
    return (
      "Vyve OTP tables are missing or not in the API schema cache. " +
      "In Supabase SQL Editor run, in order: 001_vyve_schema.sql, 002_vyve_otp_whatsapp.sql, " +
      "004_vyve_otp_outbound_queue.sql. Then Settings → API → reload schema if available."
    );
  }
  return undefined;
}

export function safeSupabaseDetail(err: PostgrestError | null | undefined): string | undefined {
  if (!err) return undefined;
  if (process.env.NODE_ENV !== "development") return undefined;
  return [err.message, err.hint, err.details].filter(Boolean).join(" — ") || undefined;
}

/** Short technical line for OTP flows (shown in UI so deploy issues are diagnosable). */
export function supabaseErrorSummary(err: PostgrestError | null | undefined): string | undefined {
  if (!err) return undefined;
  return [err.message, err.hint].filter(Boolean).join(" — ").slice(0, 600) || undefined;
}
