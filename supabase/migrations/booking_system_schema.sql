-- Enhanced Booking System Schema for Mental Health Platform
-- This migration adds comprehensive tables for the counselor booking system

-- Drop existing tables if they exist to recreate with enhanced schema
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS therapist_availability CASCADE;
DROP TABLE IF EXISTS therapists CASCADE;

-- Therapists/Counselors Table
CREATE TABLE therapists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text NOT NULL,
  languages text NOT NULL,
  center_name text,
  center_address text,
  bio text,
  experience_years integer DEFAULT 0,
  rating decimal(3,2) DEFAULT 0.0,
  total_sessions integer DEFAULT 0,
  is_available boolean DEFAULT true,
  online_consultation boolean DEFAULT true,
  offline_consultation boolean DEFAULT true,
  hourly_rate decimal(10,2),
  profile_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings Table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_anon_id text NOT NULL, -- Anonymous ID for privacy
  therapist_id uuid REFERENCES therapists(id) ON DELETE CASCADE NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  mode text NOT NULL CHECK (mode IN ('online', 'offline')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
  notes text,
  meeting_link text, -- For online sessions
  meeting_address text, -- For offline sessions
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Prevent double booking
  UNIQUE(therapist_id, appointment_date, appointment_time)
);

-- Therapist Availability Table
CREATE TABLE therapist_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id uuid REFERENCES therapists(id) ON DELETE CASCADE,
  day_of_week integer CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_availability ENABLE ROW LEVEL SECURITY;

-- Therapists policies (readable by all, manageable by admins)
CREATE POLICY "Therapists are viewable by everyone" ON therapists
  FOR SELECT USING (true);

CREATE POLICY "Therapists are manageable by admins" ON therapists
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
-- RLS Policies for bookings (users can only see their own, admins see all)
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (student_anon_id = auth.jwt() ->> 'anon_id' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can create their own bookings" ON bookings
  FOR INSERT WITH CHECK (student_anon_id = auth.jwt() ->> 'anon_id');

CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (student_anon_id = auth.jwt() ->> 'anon_id' OR auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for availability (readable by all, manageable by admins)
CREATE POLICY "Availability is viewable by everyone" ON therapist_availability
  FOR SELECT USING (true);

CREATE POLICY "Availability is manageable by admins" ON therapist_availability
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes for better performance
CREATE INDEX idx_bookings_student_anon_id ON bookings(student_anon_id);
CREATE INDEX idx_bookings_therapist_id ON bookings(therapist_id);
CREATE INDEX idx_bookings_date_time ON bookings(appointment_date, appointment_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_therapist_availability_therapist_id ON therapist_availability(therapist_id);
CREATE INDEX idx_therapists_specialization ON therapists(specialization);

-- Insert sample therapists with enhanced data
INSERT INTO therapists (name, specialization, languages, center_name, center_address, bio, experience_years, rating, total_sessions, online_consultation, offline_consultation, hourly_rate, profile_image_url) VALUES
('Dr. Sarah Johnson', 'Anxiety & Stress Management', 'English, Hindi', 'MindCare Center', '123 Wellness Street, Mumbai', 'Specialized in cognitive behavioral therapy with 8 years of experience helping students manage academic stress.', 8, 4.8, 156, true, true, 800.00, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300'),
('Dr. Rajesh Kumar', 'Depression & Mood Disorders', 'Hindi, English, Bengali', 'Healing Hearts Clinic', '45 Peace Avenue, Delhi', 'Expert in treating depression and mood disorders with a holistic approach combining therapy and mindfulness.', 12, 4.9, 298, true, true, 1000.00, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300'),
('Dr. Priya Sharma', 'Academic Stress & Performance', 'English, Hindi, Gujarati', 'Student Wellness Hub', '78 Education Lane, Bangalore', 'Specialized in helping students overcome academic pressure and develop healthy study habits.', 6, 4.7, 89, true, false, 700.00, 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=300'),
('Dr. Arjun Malhotra', 'Trauma & PTSD', 'Hindi, Marathi, English', 'Mindful Wellness Center', '12 Hope Street, Chennai', 'Licensed trauma specialist with expertise in EMDR and trauma-focused cognitive behavioral therapy, with cultural sensitivity in treatment approaches.', 10, 4.9, 187, true, true, 1200.00, 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300'),
('Dr. Anita Patel', 'Relationship & Social Anxiety', 'Hindi, English, Marathi', 'Connect Counseling', '56 Harmony Road, Pune', 'Helping individuals build confidence and improve social connections through evidence-based therapy.', 7, 4.6, 134, true, true, 850.00, 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300');

-- Insert sample availability (9 AM to 6 PM, Monday to Friday for all therapists)
INSERT INTO therapist_availability (therapist_id, day_of_week, start_time, end_time) 
SELECT id, generate_series(1, 5), '09:00:00', '18:00:00' 
FROM therapists;

-- Insert some sample bookings for demo
INSERT INTO bookings (student_anon_id, therapist_id, appointment_date, appointment_time, mode, status, notes, meeting_link)
SELECT 
  'anon_user_' || substr(gen_random_uuid()::text, 1, 8),
  id,
  CURRENT_DATE + (random() * 14)::integer,
  ('10:00:00'::time + (random() * interval '8 hours')),
  CASE WHEN random() > 0.5 THEN 'online' ELSE 'offline' END,
  CASE 
    WHEN random() > 0.7 THEN 'pending'
    WHEN random() > 0.4 THEN 'accepted'
    ELSE 'completed'
  END,
  'Sample booking for demonstration',
  CASE WHEN random() > 0.5 THEN 'https://meet.google.com/sample-link-' || substr(gen_random_uuid()::text, 1, 8) ELSE NULL END
FROM therapists
LIMIT 8;

-- Function to get available time slots for a therapist on a specific date
CREATE OR REPLACE FUNCTION get_available_slots(
  therapist_uuid UUID,
  booking_date DATE
) RETURNS TABLE(time_slot TIME) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT (ta.start_time + (INTERVAL '1 hour' * slot_hour))::time as time_slot
  FROM therapist_availability ta
  CROSS JOIN generate_series(0, 8) as slot_hour
  WHERE ta.therapist_id = therapist_uuid
    AND ta.day_of_week = EXTRACT(DOW FROM booking_date)
    AND ta.is_available = true
    AND NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.therapist_id = therapist_uuid
        AND b.appointment_date = booking_date
        AND b.appointment_time = (ta.start_time + (INTERVAL '1 hour' * slot_hour))::time
        AND b.status NOT IN ('cancelled', 'declined')
    )
    AND (ta.start_time + (INTERVAL '1 hour' * slot_hour)) < ta.end_time
  ORDER BY time_slot;
END;
$$ LANGUAGE plpgsql;
