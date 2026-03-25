-- WhatsApp OTP (custom; not Supabase SMS)
CREATE TABLE IF NOT EXISTS vyve_otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_e164 TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts SMALLINT NOT NULL DEFAULT 0,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vyve_otp_phone_created
  ON vyve_otp_codes (phone_e164, created_at DESC);

-- Partial index: cannot use now() in WHERE (not IMMUTABLE). Filter expiry in queries.
CREATE INDEX IF NOT EXISTS idx_vyve_otp_phone_unconsumed
  ON vyve_otp_codes (phone_e164, created_at DESC)
  WHERE consumed_at IS NULL;

COMMENT ON TABLE vyve_otp_codes IS 'Short-lived login codes delivered via WhatsApp; verified server-side only.';
