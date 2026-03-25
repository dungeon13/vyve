import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  markWhatsAppMessageRead,
  parseInboundWebhookMessage,
  sendWhatsAppText,
  verifyMetaWebhookChallenge,
} from "@/lib/whatsapp/cloud-api";

export const dynamic = "force-dynamic";

/**
 * Meta WhatsApp — same contract as EchoMind `GET/POST /webhook`.
 * Callback URL: https://<host>/webhook
 * Verify token: WA_VERIFY_TOKEN (must match Meta dashboard).
 * POST body: always respond JSON `{ "status": "ok" }` like EchoMind.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const verifyToken = process.env.WA_VERIFY_TOKEN;
  const ok = verifyMetaWebhookChallenge(mode, token, challenge, verifyToken);

  console.log("[webhook] GET", {
    mode,
    hasChallenge: Boolean(challenge),
    tokenMatch: Boolean(verifyToken && token?.trim() === verifyToken.trim()),
    verified: ok !== null,
  });

  if (!verifyToken) {
    return new NextResponse("WA_VERIFY_TOKEN is not configured", { status: 500 });
  }

  if (ok !== null) {
    return new NextResponse(ok, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new NextResponse(null, { status: 403 });
}

export async function POST(request: NextRequest) {
  console.log("[webhook] POST received");

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    console.log("[webhook] POST body not valid JSON");
    return NextResponse.json({ status: "ok" });
  }

  try {
    const inbound = parseInboundWebhookMessage(body);
    if (!inbound) {
      console.log("[webhook] POST ignored (no user message in payload — e.g. statuses)");
      return NextResponse.json({ status: "ok" });
    }

    console.log("[webhook] POST user message", {
      type: inbound.messageType,
      hasMessageId: Boolean(inbound.messageId),
    });

    if (inbound.messageId) {
      void markWhatsAppMessageRead(inbound.messageId);
    }

    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    const { data: row, error } = await supabase
      .from("vyve_otp_outbound_queue")
      .select("id, otp_plain")
      .eq("phone_digits", inbound.fromDigits)
      .gt("expires_at", now)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[webhook] queue read error:", error);
      return NextResponse.json({ status: "ok" });
    }

    if (row?.otp_plain) {
      console.log("[webhook] POST sending queued OTP from outbound queue");
      const text =
        `Your Vyve verification code is *${row.otp_plain}*. It expires in 10 minutes.\n\n` +
        `If you did not request this, ignore this message.`;

      await sendWhatsAppText(inbound.fromDigits, text);
      await supabase.from("vyve_otp_outbound_queue").delete().eq("id", row.id);
    } else {
      console.log("[webhook] POST no matching queued OTP for this sender");
    }
  } catch (e) {
    console.error("[webhook] error:", e);
  }

  return NextResponse.json({ status: "ok" });
}
