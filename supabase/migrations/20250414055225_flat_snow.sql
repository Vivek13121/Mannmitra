/*
  # User Data Schema

  1. New Tables
    - `user_chat_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role` (text)
      - `content` (text)
      - `timestamp` (timestamptz)
    
    - `user_mood_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `mood` (integer)
      - `notes` (text)
      - `date` (timestamptz)
    
    - `user_wellness_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (timestamptz)
      - `tasks` (jsonb)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Chat History Table
CREATE TABLE IF NOT EXISTS user_chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE user_chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own chat history"
  ON user_chat_history
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Mood Entries Table
CREATE TABLE IF NOT EXISTS user_mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  mood integer NOT NULL,
  notes text,
  date timestamptz DEFAULT now()
);

ALTER TABLE user_mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own mood entries"
  ON user_mood_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Wellness Plans Table
CREATE TABLE IF NOT EXISTS user_wellness_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date timestamptz DEFAULT now(),
  tasks jsonb NOT NULL
);

ALTER TABLE user_wellness_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wellness plans"
  ON user_wellness_plans
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Venting Entries Table (for SIH Vent It Out feature)
CREATE TABLE IF NOT EXISTS venting_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'voice')),
  emotion text NOT NULL,
  confidence float NOT NULL,
  is_high_risk boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE venting_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own venting entries"
  ON venting_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin view for aggregated data (no personal info)
CREATE VIEW admin_mental_health_trends AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  emotion,
  COUNT(*) as count,
  AVG(confidence) as avg_confidence,
  COUNT(*) FILTER (WHERE is_high_risk = true) as high_risk_count
FROM venting_entries
GROUP BY DATE_TRUNC('day', created_at), emotion
ORDER BY date DESC;