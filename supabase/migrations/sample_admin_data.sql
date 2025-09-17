-- Sample data for testing the Admin Dashboard

-- First, create an admin user (you'll need to run this after creating a real user account)
-- Replace 'your-user-uuid-here' with an actual user UUID from auth.users
INSERT INTO admin_users (user_id, role, name, email, is_active) VALUES
  ('00000000-0000-0000-0000-000000000000', 'admin', 'Test Admin', 'admin@mannmitra.com', true);

-- Sample emotion analysis logs
INSERT INTO emotion_analysis_logs (
  anonymous_user_id, 
  analysis_type, 
  primary_emotion, 
  emotion_scores, 
  sentiment_score, 
  confidence, 
  is_crisis, 
  crisis_indicators, 
  detected_keywords,
  session_duration_seconds,
  created_at
) VALUES
  ('user_001', 'text', 'anxiety', '{"anxiety":0.8,"stress":0.6,"sad":0.3}', -0.4, 0.85, false, '{}', '["worried","nervous","exam"]', 120, NOW() - INTERVAL '1 hour'),
  ('user_002', 'text', 'stressed', '{"stressed":0.9,"anxiety":0.4,"tired":0.2}', -0.6, 0.78, false, '{}', '["overwhelmed","deadline","pressure"]', 180, NOW() - INTERVAL '2 hours'),
  ('user_003', 'voice', 'sad', '{"sad":0.7,"lonely":0.5,"depressed":0.4}', -0.7, 0.82, true, '["hopeless","worthless"]', '["depressed","crying","alone"]', 240, NOW() - INTERVAL '30 minutes'),
  ('user_004', 'text', 'angry', '{"angry":0.8,"frustrated":0.6,"annoyed":0.3}', -0.5, 0.75, false, '{}', '["mad","furious","unfair"]', 90, NOW() - INTERVAL '45 minutes'),
  ('user_005', 'text', 'happy', '{"happy":0.9,"excited":0.4,"content":0.3}', 0.8, 0.88, false, '{}', '["great","wonderful","amazing"]', 60, NOW() - INTERVAL '15 minutes'),
  ('user_001', 'voice', 'anxiety', '{"anxiety":0.9,"panic":0.7,"fear":0.5}', -0.8, 0.92, true, '["panic","cant cope"]', '["panic attack","overwhelming","scared"]', 300, NOW() - INTERVAL '10 minutes');

-- Sample crisis alerts
INSERT INTO crisis_alerts (
  anonymous_user_id,
  severity,
  emotion_detected,
  confidence_score,
  keywords_detected,
  content_snippet,
  detected_at,
  status
) VALUES
  ('user_003', 'high', 'sad', 0.82, '["hopeless","worthless"]', 'I feel so hopeless and worthless, like nothing I do matters anymore...', NOW() - INTERVAL '30 minutes', 'pending'),
  ('user_001', 'critical', 'anxiety', 0.92, '["panic","cant cope","end it all"]', 'Having panic attacks daily, cant cope anymore, sometimes think about ending it all...', NOW() - INTERVAL '10 minutes', 'pending'),
  ('user_006', 'medium', 'stressed', 0.75, '["overwhelmed","exhausted"]', 'So overwhelmed with everything, feeling completely exhausted...', NOW() - INTERVAL '2 hours', 'acknowledged'),
  ('user_007', 'high', 'angry', 0.88, '["hurt myself","rage"]', 'So angry I want to hurt myself, filled with rage...', NOW() - INTERVAL '1 day', 'resolved');

-- Sample resource interactions
INSERT INTO resource_interactions (
  anonymous_user_id,
  resource_type,
  resource_id,
  resource_title,
  interaction_type,
  duration_seconds,
  user_emotion_before,
  user_emotion_after,
  created_at
) VALUES
  ('user_001', 'article', 'anxiety-guide-001', 'Managing Anxiety: A Student Guide', 'view', 180, 'anxiety', 'neutral', NOW() - INTERVAL '1 hour'),
  ('user_002', 'video', 'stress-relief-001', 'Quick Stress Relief Techniques', 'complete', 420, 'stressed', 'happy', NOW() - INTERVAL '2 hours'),
  ('user_003', 'audio', 'meditation-001', 'Calming Meditation for Depression', 'view', 600, 'sad', 'neutral', NOW() - INTERVAL '45 minutes'),
  ('user_004', 'exercise', 'breathing-001', 'Deep Breathing Exercise', 'complete', 300, 'angry', 'neutral', NOW() - INTERVAL '30 minutes'),
  ('user_005', 'helpline', 'crisis-support', 'National Crisis Helpline', 'click', 5, 'sad', 'sad', NOW() - INTERVAL '20 minutes'),
  ('user_001', 'article', 'panic-attacks', 'Understanding Panic Attacks', 'view', 240, 'anxiety', 'anxiety', NOW() - INTERVAL '15 minutes');

-- Update timestamps to create realistic patterns
UPDATE emotion_analysis_logs SET created_at = 
  CASE 
    WHEN primary_emotion = 'anxiety' THEN NOW() - INTERVAL '1 hour'
    WHEN primary_emotion = 'stressed' THEN NOW() - INTERVAL '2 hours'
    WHEN primary_emotion = 'sad' THEN NOW() - INTERVAL '30 minutes'
    WHEN primary_emotion = 'angry' THEN NOW() - INTERVAL '45 minutes'
    ELSE NOW() - INTERVAL '15 minutes'
  END;

-- Add more historical data for trends (last 7 days)
INSERT INTO emotion_analysis_logs (
  anonymous_user_id, 
  analysis_type, 
  primary_emotion, 
  emotion_scores, 
  sentiment_score, 
  confidence, 
  is_crisis, 
  crisis_indicators, 
  detected_keywords,
  session_duration_seconds,
  created_at
) 
SELECT 
  'user_' || generate_series % 10,
  CASE WHEN random() > 0.5 THEN 'text' ELSE 'voice' END,
  (ARRAY['anxiety', 'stressed', 'sad', 'angry', 'happy', 'neutral'])[1 + floor(random() * 6)],
  '{"primary":0.8,"secondary":0.4}',
  random() * 2 - 1, -- Random sentiment between -1 and 1
  0.5 + random() * 0.4, -- Random confidence between 0.5 and 0.9
  random() < 0.1, -- 10% chance of crisis
  CASE WHEN random() < 0.1 THEN '["hopeless"]' ELSE '[]' END,
  '["keyword1","keyword2"]',
  60 + random() * 300, -- Random duration between 60-360 seconds
  NOW() - INTERVAL '1 day' * generate_series
FROM generate_series(1, 50);

COMMENT ON TABLE admin_users IS 'Admin dashboard users with role-based access';
COMMENT ON TABLE emotion_analysis_logs IS 'Anonymized emotion analysis results for admin monitoring';
COMMENT ON TABLE crisis_alerts IS 'Crisis detection alerts for immediate admin attention';
COMMENT ON TABLE resource_interactions IS 'User interactions with mental health resources';
