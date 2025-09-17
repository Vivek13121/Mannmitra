/*
  # Admin Dashboard Schema for MannMitra SIH
  
  1. Enhanced Tables for Admin Dashboard
    - Crisis alerts tracking
    - Admin users and roles
    - Resource effectiveness tracking
    - Enhanced emotion analysis logging
  
  2. Security
    - Admin-only access policies
    - Anonymous data aggregation views
*/

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('admin', 'counselor', 'supervisor')),
  name text NOT NULL,
  email text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated admin users can access admin data
CREATE POLICY "Admin users can manage admin data"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

-- Crisis Alerts Table
CREATE TABLE IF NOT EXISTS crisis_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_user_id text NOT NULL, -- Hash of actual user_id for anonymity
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  emotion_detected text NOT NULL,
  confidence_score float NOT NULL,
  keywords_detected text[], -- Array of crisis keywords
  content_snippet text, -- First 100 chars for context (anonymized)
  detected_at timestamptz DEFAULT now(),
  acknowledged_by uuid REFERENCES admin_users(id),
  acknowledged_at timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'resolved', 'escalated')),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crisis_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage crisis alerts"
  ON crisis_alerts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

-- Enhanced Emotion Logs Table (anonymized)
CREATE TABLE IF NOT EXISTS emotion_analysis_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_user_id text NOT NULL, -- Hash of actual user_id
  session_id uuid DEFAULT gen_random_uuid(),
  analysis_type text NOT NULL CHECK (analysis_type IN ('text', 'voice')),
  primary_emotion text NOT NULL,
  emotion_scores jsonb NOT NULL, -- {'happy': 0.1, 'sad': 0.7, 'angry': 0.2}
  sentiment_score float, -- -1 to 1
  confidence float NOT NULL,
  is_crisis boolean DEFAULT false,
  crisis_indicators text[], -- Array of detected crisis patterns
  detected_keywords text[],
  session_duration_seconds integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emotion_analysis_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view emotion logs"
  ON emotion_analysis_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

-- Resource Interaction Logs
CREATE TABLE IF NOT EXISTS resource_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_user_id text NOT NULL,
  resource_type text NOT NULL CHECK (resource_type IN ('article', 'video', 'audio', 'exercise', 'helpline')),
  resource_id text NOT NULL,
  resource_title text NOT NULL,
  interaction_type text NOT NULL CHECK (interaction_type IN ('view', 'click', 'download', 'share', 'complete')),
  duration_seconds integer,
  user_emotion_before text,
  user_emotion_after text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE resource_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view resource interactions"
  ON resource_interactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

-- Dashboard Analytics Views
CREATE OR REPLACE VIEW admin_emotion_trends AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  primary_emotion,
  COUNT(*) as session_count,
  AVG(confidence) as avg_confidence,
  COUNT(*) FILTER (WHERE is_crisis = true) as crisis_count,
  AVG(sentiment_score) as avg_sentiment
FROM emotion_analysis_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at), primary_emotion
ORDER BY date DESC, session_count DESC;

CREATE OR REPLACE VIEW admin_crisis_summary AS
SELECT 
  DATE_TRUNC('day', detected_at) as date,
  severity,
  COUNT(*) as alert_count,
  COUNT(*) FILTER (WHERE status = 'resolved') as resolved_count,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count
FROM crisis_alerts
WHERE detected_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('day', detected_at), severity
ORDER BY date DESC;

CREATE OR REPLACE VIEW admin_usage_stats AS
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(DISTINCT anonymous_user_id) as unique_users,
  COUNT(*) as total_sessions,
  AVG(session_duration_seconds) as avg_session_duration,
  COUNT(*) FILTER (WHERE is_crisis = true) as crisis_sessions
FROM emotion_analysis_logs
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;

CREATE OR REPLACE VIEW admin_resource_effectiveness AS
SELECT 
  resource_type,
  resource_title,
  COUNT(*) as total_interactions,
  COUNT(DISTINCT anonymous_user_id) as unique_users,
  AVG(duration_seconds) as avg_duration,
  COUNT(*) FILTER (WHERE interaction_type = 'complete') as completions,
  ROUND(
    COUNT(*) FILTER (WHERE interaction_type = 'complete')::numeric / 
    COUNT(*)::numeric * 100, 2
  ) as completion_rate
FROM resource_interactions
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY resource_type, resource_title
ORDER BY total_interactions DESC;

-- Functions for dashboard data
CREATE OR REPLACE FUNCTION get_admin_dashboard_summary()
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_sessions_today', (
      SELECT COUNT(*) FROM emotion_analysis_logs 
      WHERE created_at >= CURRENT_DATE
    ),
    'unique_users_today', (
      SELECT COUNT(DISTINCT anonymous_user_id) FROM emotion_analysis_logs 
      WHERE created_at >= CURRENT_DATE
    ),
    'crisis_alerts_pending', (
      SELECT COUNT(*) FROM crisis_alerts 
      WHERE status = 'pending'
    ),
    'crisis_alerts_today', (
      SELECT COUNT(*) FROM crisis_alerts 
      WHERE detected_at >= CURRENT_DATE
    ),
    'avg_sentiment_today', (
      SELECT ROUND(AVG(sentiment_score)::numeric, 2) FROM emotion_analysis_logs 
      WHERE created_at >= CURRENT_DATE AND sentiment_score IS NOT NULL
    ),
    'most_common_emotion_today', (
      SELECT primary_emotion FROM emotion_analysis_logs 
      WHERE created_at >= CURRENT_DATE
      GROUP BY primary_emotion
      ORDER BY COUNT(*) DESC
      LIMIT 1
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_admin_dashboard_summary() TO authenticated;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_emotion_logs_date ON emotion_analysis_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_emotion_logs_anonymous_user ON emotion_analysis_logs(anonymous_user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_logs_emotion ON emotion_analysis_logs(primary_emotion);
CREATE INDEX IF NOT EXISTS idx_crisis_alerts_date ON crisis_alerts(detected_at);
CREATE INDEX IF NOT EXISTS idx_crisis_alerts_status ON crisis_alerts(status);
CREATE INDEX IF NOT EXISTS idx_resource_interactions_date ON resource_interactions(created_at);
