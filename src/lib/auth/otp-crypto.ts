import { createHash, randomInt } from "crypto";

function getPepper(): string {
  const p = process.env.OTP_SECRET;
  if (!p || p.length < 16) {
    throw new Error(
      "OTP_SECRET must be set (min 16 chars). Generate with: openssl rand -hex 32"
    );
  }
  return p;
}

export function generateOtpCode(): string {
  return String(randomInt(100000, 1000000));
}

export function hashOtp(phoneE164: string, code: string): string {
  return createHash("sha256")
    .update(`${phoneE164}:${code}:${getPepper()}`)
    .digest("hex");
}
