import { createHash, randomInt } from "crypto";

/** Call before OTP routes use hashOtp; avoids opaque 500s when env is missing. */
export function getOtpSecretConfigError(): string | null {
  const p = process.env.OTP_SECRET?.trim();
  if (!p || p.length < 16) {
    return (
      "Set OTP_SECRET in production (e.g. Railway: Project → Variables → OTP_SECRET). " +
      "Min 16 characters; local dev uses .env.local. Generate: openssl rand -hex 32"
    );
  }
  return null;
}

function getPepper(): string {
  const err = getOtpSecretConfigError();
  if (err) {
    throw new Error(`OTP_SECRET: ${err}`);
  }
  return process.env.OTP_SECRET!.trim();
}

export function generateOtpCode(): string {
  return String(randomInt(100000, 1000000));
}

export function hashOtp(phoneE164: string, code: string): string {
  return createHash("sha256")
    .update(`${phoneE164}:${code}:${getPepper()}`)
    .digest("hex");
}
