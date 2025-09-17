-- MannMitra Mental Health Platform Database Schema
-- Run this in your Supabase SQL Editor after creating the project

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Chat History Table
CREATE TABLE IF NOT EXISTS user_chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own chat history
CREATE POLICY "Users can manage their own chat history"
  ON user_chat_history
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Mood Entries Table
CREATE TABLE IF NOT EXISTS user_mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  mood integer NOT NULL CHECK (mood >= 1 AND mood <= 10),
  notes text,
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_mood_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own mood entries
CREATE POLICY "Users can manage their own mood entries"
  ON user_mood_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Wellness Plans Table
CREATE TABLE IF NOT EXISTS user_wellness_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date timestamptz DEFAULT now(),
  tasks jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_wellness_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own wellness plans
CREATE POLICY "Users can manage their own wellness plans"
  ON user_wellness_plans
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Venting Entries Table (for Vent It Out feature)
CREATE TABLE IF NOT EXISTS venting_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'voice')),
  emotion text NOT NULL,
  confidence float NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  is_high_risk boolean DEFAULT false,
  content text,
  coping_response text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE venting_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own venting entries
CREATE POLICY "Users can manage their own venting entries"
  ON venting_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin Analytics View (Anonymized data for admin dashboard)
CREATE OR REPLACE VIEW admin_mental_health_trends AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  emotion,
  COUNT(*) as count,
  AVG(confidence) as avg_confidence,
  COUNT(*) FILTER (WHERE is_high_risk = true) as high_risk_count
FROM venting_entries
GROUP BY DATE_TRUNC('day', created_at), emotion
ORDER BY date DESC;

-- Admin Mood Analytics View
CREATE OR REPLACE VIEW admin_mood_trends AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  AVG(mood) as avg_mood,
  COUNT(*) as entry_count,
  COUNT(*) FILTER (WHERE mood <= 3) as low_mood_count,
  COUNT(*) FILTER (WHERE mood >= 8) as high_mood_count
FROM user_mood_entries
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Grant access to analytics views for authenticated users (for admin role)
GRANT SELECT ON admin_mental_health_trends TO authenticated;
GRANT SELECT ON admin_mood_trends TO authenticated;

-- Success message
SELECT 'Database schema created successfully! 🎉' as message;
