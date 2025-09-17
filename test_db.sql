-- Test query for new venting_entries table
-- This ensures the migration was successful

-- Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'venting_entries'
);

-- Test admin view
SELECT * FROM admin_mental_health_trends LIMIT 5;

-- Show table structure
\d venting_entries;
