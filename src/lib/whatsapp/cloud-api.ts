/**
 * Meta WhatsApp Cloud API — outbound text + webhook payload parsing.
 */

export function digitsOnlyE164(phone: string): string {
  return phone.replace(/\D/g, "");
}

export async function sendWhatsAppText(toDigits: string, body: string): Promise<void> {
  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID;
  const token = process.env.WA_ACCESS_TOKEN;

  if (!phoneNumberId || !token) {
    throw new Error("WA_PHONE_NUMBER_ID or WA_ACCESS_TOKEN is not set");
  }

  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: digitsOnlyE164(toDigits),
      type: "text",
      text: { body },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WhatsApp send failed (${res.status}): ${text}`);
  }
}

/** Meta inbound webhook: first text message sender id (digits only, e.g. 9198…). */
export function parseInboundMessageFrom(body: unknown): string | null {
  try {
    const o = body as {
      entry?: Array<{
        changes?: Array<{
          value?: { messages?: Array<{ from?: string }> };
        }>;
      }>;
    };
    const from = o?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
    if (typeof from === "string" && from.length > 0) {
      return digitsOnlyE164(from);
    }
    return null;
  } catch {
    return null;
  }
}

export function verifyMetaWebhookChallenge(
  mode: string | null,
  token: string | null,
  challenge: string | null,
  expectedVerifyToken: string | undefined
): string | null {
  if (!expectedVerifyToken) return null;
  const t = token?.trim();
  if (mode === "subscribe" && t === expectedVerifyToken.trim() && challenge) {
    return challenge;
  }
  return null;
}
