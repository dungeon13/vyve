-- Phase 2: Real data procurement, benchmarking, and activity recommendations

CREATE TABLE IF NOT EXISTS vyve_city_master (
  city_id TEXT PRIMARY KEY,
  city_name TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'IN',
  aliases TEXT[] NOT NULL DEFAULT '{}',
  tier TEXT NOT NULL DEFAULT 'metro_1',
  state_or_ut TEXT,
  lat NUMERIC,
  lng NUMERIC,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vyve_benchmark_source_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT NOT NULL,
  run_type TEXT NOT NULL CHECK (run_type IN ('daily', 'weekly', 'monthly', 'manual')),
  status TEXT NOT NULL CHECK (status IN ('running', 'success', 'failed')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  rows_loaded INTEGER NOT NULL DEFAULT 0,
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS vyve_city_benchmarks_weekly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id TEXT NOT NULL REFERENCES vyve_city_master(city_id),
  period_week TEXT NOT NULL,
  source_id TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'index',
  segment_key TEXT NOT NULL DEFAULT 'all',
  coverage_score NUMERIC NOT NULL DEFAULT 0.5,
  freshness_days INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (city_id, period_week, source_id, metric_name, segment_key)
);

CREATE TABLE IF NOT EXISTS vyve_model_calibration_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_key TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  weights JSONB NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS vyve_user_feature_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES vyve_users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  city_id TEXT NOT NULL REFERENCES vyve_city_master(city_id),
  segment_key TEXT NOT NULL,
  features JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vyve_score_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  score_id UUID REFERENCES vyve_scores(id) ON DELETE CASCADE,
  calibration_version TEXT NOT NULL,
  top_positive_drivers JSONB NOT NULL DEFAULT '[]',
  top_risk_drivers JSONB NOT NULL DEFAULT '[]',
  confidence NUMERIC NOT NULL DEFAULT 0.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vyve_activity_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  cost_band TEXT NOT NULL DEFAULT 'unknown' CHECK (cost_band IN ('low', 'medium', 'high', 'unknown')),
  source_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vyve_activity_city_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES vyve_activity_catalog(id) ON DELETE CASCADE,
  city_id TEXT NOT NULL REFERENCES vyve_city_master(city_id),
  lat NUMERIC,
  lng NUMERIC,
  rating NUMERIC,
  hours_text TEXT,
  availability_signal NUMERIC NOT NULL DEFAULT 0.5,
  source_confidence NUMERIC NOT NULL DEFAULT 0.5,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (activity_id, city_id, lat, lng)
);

CREATE TABLE IF NOT EXISTS vyve_activity_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES vyve_users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  city_id TEXT NOT NULL REFERENCES vyve_city_master(city_id),
  weakest_pillar TEXT NOT NULL CHECK (weakest_pillar IN ('financial', 'career', 'health')),
  activity_id UUID NOT NULL REFERENCES vyve_activity_catalog(id),
  rank_position INTEGER NOT NULL,
  score NUMERIC NOT NULL,
  reasoning JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_city_benchmarks_city_week
  ON vyve_city_benchmarks_weekly(city_id, period_week);
CREATE INDEX IF NOT EXISTS idx_city_benchmarks_metric
  ON vyve_city_benchmarks_weekly(metric_name, segment_key);
CREATE INDEX IF NOT EXISTS idx_activity_availability_city
  ON vyve_activity_city_availability(city_id, availability_signal DESC);
CREATE INDEX IF NOT EXISTS idx_activity_recs_session
  ON vyve_activity_recommendations(session_id, created_at DESC);

ALTER TABLE vyve_benchmark_source_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyve_city_benchmarks_weekly ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyve_model_calibration_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyve_user_feature_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyve_score_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyve_activity_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyve_activity_city_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyve_activity_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyve_city_master ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access benchmark runs"
  ON vyve_benchmark_source_runs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access city benchmarks"
  ON vyve_city_benchmarks_weekly FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access calibration versions"
  ON vyve_model_calibration_versions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access feature snapshots"
  ON vyve_user_feature_snapshots FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access score explanations"
  ON vyve_score_explanations FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access activity catalog"
  ON vyve_activity_catalog FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access activity availability"
  ON vyve_activity_city_availability FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access activity recommendations"
  ON vyve_activity_recommendations FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access city master"
  ON vyve_city_master FOR ALL TO service_role USING (true) WITH CHECK (true);
