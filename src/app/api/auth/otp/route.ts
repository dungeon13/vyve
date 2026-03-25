import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { generateOtpCode, hashOtp } from "@/lib/auth/otp-crypto";
import { digitsOnlyE164, sendWhatsAppText } from "@/lib/whatsapp/cloud-api";
import {
  hintForMissingVyveOtpTable,
  supabaseErrorSummary,
} from "@/lib/supabase/errors";

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_SENDS_PER_WINDOW = 3;
const SEND_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json() as { phone?: string };

    if (!phone || !phone.startsWith("+91") || phone.replace(/\D/g, "").length < 12) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const windowStart = new Date(Date.now() - SEND_WINDOW_MS).toISOString();

    const { count, error: countError } = await supabase
      .from("vyve_otp_codes")
      .select("*", { count: "exact", head: true })
      .eq("phone_e164", phone)
      .gte("created_at", windowStart);

    if (countError) {
      console.error("OTP rate count error:", countError);
      const hint = hintForMissingVyveOtpTable(countError);
      return NextResponse.json(
        {
          error: hint ? "Database not ready for OTP." : "Could not send code",
          hint,
          details: supabaseErrorSummary(countError),
        },
        { status: 500 }
      );
    }

    if ((count ?? 0) >= MAX_SENDS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Too many codes requested. Try again in 15 minutes." },
        { status: 429 }
      );
    }

    await supabase
      .from("vyve_otp_codes")
      .update({ consumed_at: new Date().toISOString() })
      .eq("phone_e164", phone)
      .is("consumed_at", null);

    const code = generateOtpCode();
    const codeHash = hashOtp(phone, code);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

    const { error: insertError } = await supabase.from("vyve_otp_codes").insert({
      phone_e164: phone,
      code_hash: codeHash,
      expires_at: expiresAt,
    });

    if (insertError) {
      console.error("OTP insert error:", insertError);
      const hint = hintForMissingVyveOtpTable(insertError);
      return NextResponse.json(
        {
          error: hint ? "Database not ready for OTP." : "Could not create code",
          hint,
          details: supabaseErrorSummary(insertError),
        },
        { status: 500 }
      );
    }

    const waDigits = digitsOnlyE164(phone);
    const message =
      `Your Vyve verification code is *${code}*. It expires in 10 minutes.\n\n` +
      `If you did not request this, ignore this message.`;

    await supabase.from("vyve_otp_outbound_queue").delete().eq("phone_digits", waDigits);

    const { error: queueError } = await supabase.from("vyve_otp_outbound_queue").insert({
      phone_digits: waDigits,
      otp_plain: code,
      expires_at: expiresAt,
    });

    if (queueError) {
      console.error("OTP queue insert error:", queueError);
      const hint = hintForMissingVyveOtpTable(queueError);
      return NextResponse.json(
        {
          error: "Could not queue OTP for delivery.",
          hint:
            hint ||
            "Run supabase/migrations/004_vyve_otp_outbound_queue.sql in the Supabase SQL editor.",
          details: supabaseErrorSummary(queueError),
        },
        { status: 500 }
      );
    }

    try {
      await sendWhatsAppText(waDigits, message);
      await supabase.from("vyve_otp_outbound_queue").delete().eq("phone_digits", waDigits);
      return NextResponse.json({
        success: true,
        channel: "whatsapp",
        delivery: "direct",
      });
    } catch (waErr) {
      console.error("WhatsApp direct send failed; OTP will send after user messages the business:", waErr);
      return NextResponse.json({
        success: true,
        channel: "whatsapp",
        delivery: "after_inbound_message",
        message:
          "Open WhatsApp on this number and send any message (for example: Hi) to our business WhatsApp. " +
          "Your verification code will arrive immediately after — Meta requires this step until templates are approved.",
        hint:
          "Ensure /webhook is verified in Meta (Callback URL + Verify token) and the messages field is subscribed.",
      });
    }
  } catch (error) {
    console.error("OTP error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    if (message.includes("OTP_SECRET")) {
      return NextResponse.json({ error: "Server OTP configuration missing" }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
