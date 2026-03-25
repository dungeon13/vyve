-- Queued OTP plaintext: used when Cloud API cannot send proactively until the user messages first.
-- Webhook POST delivers the code and deletes the row. Rows expire with expires_at (app enforces).
CREATE TABLE IF NOT EXISTS vyve_otp_outbound_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_digits TEXT NOT NULL,
  otp_plain TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vyve_otp_queue_phone_exp
  ON vyve_otp_outbound_queue (phone_digits, expires_at DESC);

COMMENT ON TABLE vyve_otp_outbound_queue IS 'Temporary OTP delivery via WhatsApp after inbound user message (Meta session window).';
