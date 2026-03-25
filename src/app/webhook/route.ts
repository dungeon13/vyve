import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  parseInboundMessageFrom,
  sendWhatsAppText,
  verifyMetaWebhookChallenge,
} from "@/lib/whatsapp/cloud-api";

export const dynamic = "force-dynamic";

/**
 * Meta WhatsApp Cloud API — required callback URL.
 *
 * Configure in Meta Developer → WhatsApp → Configuration:
 * - Callback URL: https://<your-domain>/webhook
 * - Verify token: same value as WA_VERIFY_TOKEN
 * - Subscribe to: messages (and message_echoes if you use them)
 *
 * After a user sends any message to your business number, Meta opens the session
 * window so we can send the queued Vyve OTP (see /api/auth/otp).
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const verifyToken = process.env.WA_VERIFY_TOKEN;
  const ok = verifyMetaWebhookChallenge(mode, token, challenge, verifyToken);

  if (!verifyToken) {
    return new NextResponse("WA_VERIFY_TOKEN is not configured", { status: 500 });
  }

  if (ok !== null) {
    return new NextResponse(ok, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(request: NextRequest) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const fromDigits = parseInboundMessageFrom(body);
  if (!fromDigits) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    const { data: row, error } = await supabase
      .from("vyve_otp_outbound_queue")
      .select("id, otp_plain")
      .eq("phone_digits", fromDigits)
      .gt("expires_at", now)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[webhook] queue read error:", error);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!row?.otp_plain) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const text =
      `Your Vyve verification code is *${row.otp_plain}*. It expires in 10 minutes.\n\n` +
      `If you did not request this, ignore this message.`;

    await sendWhatsAppText(fromDigits, text);

    await supabase.from("vyve_otp_outbound_queue").delete().eq("id", row.id);
  } catch (e) {
    console.error("[webhook] OTP delivery error:", e);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
