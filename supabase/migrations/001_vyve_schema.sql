-- Vyve V1 Database Schema
-- Run this in Supabase SQL Editor

-- Users table (created after phone OTP verification)
CREATE TABLE IF NOT EXISTS vyve_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE,
  country_code TEXT NOT NULL DEFAULT 'IN',
  city TEXT,
  age INTEGER,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Quiz responses (anonymous - no auth required)
CREATE TABLE IF NOT EXISTS vyve_quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES vyve_users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'IN',
  answers JSONB NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Scores (linked to quiz response)
CREATE TABLE IF NOT EXISTS vyve_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES vyve_users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  quiz_response_id UUID NOT NULL REFERENCES vyve_quiz_responses(id) ON DELETE CASCADE,
  financial_score INTEGER NOT NULL,
  career_score INTEGER NOT NULL,
  health_score INTEGER NOT NULL,
  emotional_state TEXT NOT NULL,
  composite_score INTEGER NOT NULL,
  cohort_key TEXT NOT NULL,
  cohort_size INTEGER NOT NULL DEFAULT 0,
  financial_percentile INTEGER NOT NULL DEFAULT 50,
  career_percentile INTEGER NOT NULL DEFAULT 50,
  health_percentile INTEGER NOT NULL DEFAULT 50,
  confidence TEXT NOT NULL DEFAULT 'early_estimate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Recommended actions
CREATE TABLE IF NOT EXISTS vyve_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES vyve_users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  action_key TEXT NOT NULL,
  pillar TEXT NOT NULL CHECK (pillar IN ('financial', 'career', 'health')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'recommended' CHECK (status IN ('recommended', 'started', 'completed', 'dismissed')),
  recommended_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Country configuration (JSONB-driven)
CREATE TABLE IF NOT EXISTS vyve_country_configs (
  country_code TEXT PRIMARY KEY,
  quiz_schema JSONB NOT NULL,
  scoring_weights JSONB NOT NULL,
  action_library JSONB NOT NULL,
  pricing JSONB NOT NULL,
  cultural_framing JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Benchmark data
CREATE TABLE IF NOT EXISTS vyve_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL DEFAULT 'IN',
  pillar TEXT NOT NULL CHECK (pillar IN ('financial', 'career', 'health')),
  cohort_key TEXT NOT NULL,
  metric TEXT NOT NULL,
  value NUMERIC NOT NULL,
  sample_size INTEGER NOT NULL DEFAULT 0,
  data_source TEXT NOT NULL DEFAULT 'seed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Monday morning briefs
CREATE TABLE IF NOT EXISTS vyve_monday_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES vyve_users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  score_change NUMERIC,
  brief_body TEXT NOT NULL,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Engagement events (server-side backup for PostHog)
CREATE TABLE IF NOT EXISTS vyve_engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES vyve_users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quiz_responses_session ON vyve_quiz_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_user ON vyve_quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_session ON vyve_scores(session_id);
CREATE INDEX IF NOT EXISTS idx_scores_user ON vyve_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_cohort ON vyve_scores(cohort_key);
CREATE INDEX IF NOT EXISTS idx_actions_session ON vyve_actions(session_id);
CREATE INDEX IF NOT EXISTS idx_actions_user ON vyve_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_benchmarks_cohort ON vyve_benchmarks(country_code, pillar, cohort_key);
CREATE INDEX IF NOT EXISTS idx_briefs_user ON vyve_monday_briefs(user_id, week_number);
CREATE INDEX IF NOT EXISTS idx_engagement_session ON vyve_engagement_events(session_id);
CREATE INDEX IF NOT EXISTS idx_engagement_type ON vyve_engagement_events(event_type, created_at);

-- RLS Policies
ALTER TABLE vyve_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyve_quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyve_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyve_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyve_monday_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyve_engagement_events ENABLE ROW LEVEL SECURITY;

-- Quiz responses: anyone can insert (anonymous quiz), service role can read all
CREATE POLICY "Anyone can create quiz responses" ON vyve_quiz_responses
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Users can read own quiz responses" ON vyve_quiz_responses
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Scores: anyone can insert, users read own
CREATE POLICY "Anyone can create scores" ON vyve_scores
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Users can read own scores" ON vyve_scores
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Actions: anyone can insert, users read/update own
CREATE POLICY "Anyone can create actions" ON vyve_actions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Users can read own actions" ON vyve_actions
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can update own actions" ON vyve_actions
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Engagement events: anyone can insert (anonymous tracking)
CREATE POLICY "Anyone can create engagement events" ON vyve_engagement_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Briefs: users read own
CREATE POLICY "Users can read own briefs" ON vyve_monday_briefs
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Service role bypass (for API routes)
CREATE POLICY "Service role full access quiz_responses" ON vyve_quiz_responses
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access scores" ON vyve_scores
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access actions" ON vyve_actions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access briefs" ON vyve_monday_briefs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access events" ON vyve_engagement_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access users" ON vyve_users
  FOR ALL TO service_role USING (true) WITH CHECK (true);
