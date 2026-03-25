/**
 * Meta WhatsApp Cloud API — matches EchoMind pattern (graph v21, same payload shape).
 * @see echomind/whatsapp_utils.py, echomind/basic.py /webhook
 */

export function digitsOnlyE164(phone: string): string {
  return phone.replace(/\D/g, "");
}

function messagesEndpointUrl(): string {
  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID;
  if (!phoneNumberId) throw new Error("WA_PHONE_NUMBER_ID is not set");
  return `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
}

function authHeaders(): HeadersInit {
  const token = process.env.WA_ACCESS_TOKEN;
  if (!token) throw new Error("WA_ACCESS_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/** Same payload as echomind send_whatsapp_message */
export async function sendWhatsAppText(toDigits: string, body: string): Promise<void> {
  const url = messagesEndpointUrl();
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
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

/** EchoMind mark_as_read — blue ticks */
export async function markWhatsAppMessageRead(messageId: string): Promise<void> {
  try {
    const url = messagesEndpointUrl();
    await fetch(url, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      }),
    });
  } catch {
    /* non-fatal */
  }
}

/**
 * EchoMind-style parse: entry[0].changes[0].value, then "messages" in value.
 * Returns null if not a user message payload (statuses, empty, etc.).
 */
export function parseInboundWebhookMessage(body: unknown): {
  fromDigits: string;
  messageId: string | null;
  messageType: string;
} | null {
  try {
    const o = body as {
      entry?: Array<{
        changes?: Array<{ value?: Record<string, unknown> }>;
      }>;
    };
    const value = o?.entry?.[0]?.changes?.[0]?.value;
    if (!value || typeof value !== "object") return null;
    if (!("messages" in value)) return null;
    const messages = value.messages;
    if (!Array.isArray(messages) || messages.length === 0) return null;

    const message = messages[0] as {
      from?: string;
      id?: string;
      type?: string;
    };
    const from = message?.from;
    if (typeof from !== "string" || !from) return null;

    return {
      fromDigits: digitsOnlyE164(from),
      messageId: typeof message.id === "string" ? message.id : null,
      messageType: typeof message.type === "string" ? message.type : "unknown",
    };
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
