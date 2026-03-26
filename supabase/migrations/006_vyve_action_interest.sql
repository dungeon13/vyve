-- Capture demand for not-yet-live priority actions
CREATE TABLE IF NOT EXISTS vyve_action_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  action_key TEXT NOT NULL,
  action_title TEXT NOT NULL,
  pillar TEXT NOT NULL CHECK (pillar IN ('financial', 'career', 'health')),
  name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vyve_action_interest_action_key
  ON vyve_action_interest(action_key, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_vyve_action_interest_session
  ON vyve_action_interest(session_id, created_at DESC);

ALTER TABLE vyve_action_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert action interest"
  ON vyve_action_interest FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Service role full access action interest"
  ON vyve_action_interest FOR ALL TO service_role USING (true) WITH CHECK (true);
