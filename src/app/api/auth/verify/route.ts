import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getOtpSecretConfigError, hashOtp } from "@/lib/auth/otp-crypto";
import { hintForMissingVyveOtpTable, supabaseErrorSummary } from "@/lib/supabase/errors";

const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  try {
    const otpSecretHint = getOtpSecretConfigError();
    if (otpSecretHint) {
      return NextResponse.json(
        { error: "Server OTP configuration missing", hint: otpSecretHint },
        { status: 500 }
      );
    }

    const { phone, otp } = await request.json() as { phone?: string; otp?: string };

    if (!phone || !otp || otp.length < 4 || otp.length > 8) {
      return NextResponse.json({ error: "Missing phone or OTP" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: row, error: fetchError } = await supabase
      .from("vyve_otp_codes")
      .select("id, code_hash, expires_at, attempts, consumed_at")
      .eq("phone_e164", phone)
      .is("consumed_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("OTP fetch error:", fetchError);
      return NextResponse.json(
        {
          error: "Verification failed",
          hint: hintForMissingVyveOtpTable(fetchError),
          details: supabaseErrorSummary(fetchError),
        },
        { status: 500 }
      );
    }

    if (!row) {
      return NextResponse.json({ error: "No active code. Request a new one." }, { status: 401 });
    }

    const priorAttempts = row.attempts ?? 0;
    if (priorAttempts >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: "Too many attempts. Request a new code." }, { status: 429 });
    }

    const expectedHash = hashOtp(phone, otp.trim());
    const ok = expectedHash === row.code_hash;

    if (!ok) {
      await supabase
        .from("vyve_otp_codes")
        .update({ attempts: priorAttempts + 1 })
        .eq("id", row.id);
      return NextResponse.json({ error: "Invalid code" }, { status: 401 });
    }

    await supabase
      .from("vyve_otp_codes")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", row.id);

    const { data: userRow, error: userError } = await supabase
      .from("vyve_users")
      .upsert(
        { phone, country_code: "IN", updated_at: new Date().toISOString() },
        { onConflict: "phone" }
      )
      .select("id")
      .single();

    if (userError) {
      console.error("vyve_users upsert error:", userError);
      return NextResponse.json(
        {
          error: "Could not save profile",
          hint: "Run supabase/migrations/001_vyve_schema.sql if vyve_users is missing.",
          details: supabaseErrorSummary(userError),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user_id: userRow.id,
      channel: "whatsapp",
    });
  } catch (error) {
    console.error("Verify error:", error);
    const message = error instanceof Error ? error.message : "";
    if (message.includes("OTP_SECRET")) {
      return NextResponse.json(
        {
          error: "Server OTP configuration missing",
          hint: getOtpSecretConfigError() ?? message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
