/**
 * Read fetch response body and parse JSON when possible.
 * Avoids silent "Failed to send code" when the server returns HTML or empty body.
 */
export async function parseApiErrorResponse(
  res: Response
): Promise<Record<string, unknown>> {
  const text = await res.text();
  if (!text.trim()) {
    return {
      error: `Request failed (${res.status})`,
      details: res.statusText || "Empty response body",
    };
  }
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {
      error: `Request failed (${res.status})`,
      details: text.slice(0, 400),
    };
  }
}

export function formatUserFacingError(data: Record<string, unknown>): string {
  const err = data.error;
  const hint = data.hint;
  const details = data.details;
  const parts = [
    typeof err === "string" ? err : "",
    typeof hint === "string" ? hint : "",
    typeof details === "string" ? details : "",
  ].filter(Boolean);
  return parts.length ? parts.join("\n\n") : "Something went wrong. Please try again.";
}
