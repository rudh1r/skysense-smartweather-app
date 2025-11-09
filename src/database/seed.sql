-- SkySense Database Seed Data
-- This file populates the database with sample data for testing
-- WARNING: This is for development/testing only!

-- ============================================================================
-- SAMPLE PROFILES
-- Note: In production, profiles are created automatically when users sign up
-- This is just for testing database structure
-- ============================================================================

-- You'll need to replace these UUIDs with actual user IDs from auth.users
-- after you create test accounts through the app

-- ============================================================================
-- SAMPLE CROWDSOURCE REPORTS
-- These are public reports that don't require authentication to view
-- ============================================================================

INSERT INTO crowdsource_reports (
  user_id,
  username,
  location_name,
  latitude,
  longitude,
  report_type,
  condition,
  description,
  temperature,
  feels_like,
  precipitation_amount,
  wind_speed,
  tags,
  upvotes,
  downvotes,
  status,
  created_at
) VALUES
  (
    NULL,
    'WeatherWatcher',
    'Golden Gate Park, San Francisco',
    37.7694,
    -122.4862,
    'temperature',
    'Foggy',
    'Dense fog rolling in from the ocean. Visibility less than 100 meters.',
    14.5,
    12.0,
    0,
    8.5,
    ARRAY['fog', 'morning', 'golden-gate'],
    15,
    2,
    'active',
    NOW() - INTERVAL '2 hours'
  ),
  (
    NULL,
    'StormChaser',
    'Downtown Los Angeles',
    34.0522,
    -118.2437,
    'precipitation',
    'Sunny',
    'Clear skies, perfect weather for outdoor activities!',
    28.0,
    30.0,
    0,
    5.0,
    ARRAY['sunny', 'clear', 'perfect'],
    42,
    1,
    'active',
    NOW() - INTERVAL '5 hours'
  ),
  (
    NULL,
    'LocalObserver',
    'Seattle Waterfront',
    47.6062,
    -122.3321,
    'precipitation',
    'Rainy',
    'Steady rain since morning. Bring an umbrella!',
    12.0,
    10.0,
    8.5,
    12.0,
    ARRAY['rain', 'umbrella', 'seattle'],
    28,
    3,
    'active',
    NOW() - INTERVAL '1 hour'
  ),
  (
    NULL,
    'SkywatcherPro',
    'Central Park, New York',
    40.7829,
    -73.9654,
    'wind',
    'Windy',
    'Strong gusty winds. Secure loose objects!',
    18.0,
    15.0,
    0,
    45.0,
    ARRAY['wind', 'gusts', 'advisory'],
    19,
    1,
    'active',
    NOW() - INTERVAL '30 minutes'
  ),
  (
    NULL,
    'WeatherGeek',
    'Miami Beach',
    25.7907,
    -80.1300,
    'temperature',
    'Hot & Humid',
    'Very hot and humid. Stay hydrated and seek shade.',
    35.0,
    42.0,
    0,
    10.0,
    ARRAY['hot', 'humidity', 'heat-warning'],
    31,
    2,
    'active',
    NOW() - INTERVAL '3 hours'
  ),
  (
    NULL,
    'CloudSpotter',
    'Chicago River Walk',
    41.8881,
    -87.6298,
    'other',
    'Partly Cloudy',
    'Beautiful scattered clouds with mild temperatures.',
    20.0,
    20.0,
    0,
    8.0,
    ARRAY['clouds', 'pleasant', 'mild'],
    25,
    0,
    'active',
    NOW() - INTERVAL '45 minutes'
  ),
  (
    NULL,
    'TempTracker',
    'Phoenix Desert',
    33.4484,
    -112.0740,
    'temperature',
    'Extremely Hot',
    'Desert heat wave. Temperatures exceeding 110°F. Avoid outdoor activities.',
    43.0,
    48.0,
    0,
    3.0,
    ARRAY['extreme-heat', 'desert', 'warning'],
    38,
    1,
    'active',
    NOW() - INTERVAL '15 minutes'
  ),
  (
    NULL,
    'SnowReporter',
    'Denver Mountains',
    39.7392,
    -104.9903,
    'precipitation',
    'Snowing',
    'Heavy snowfall in the mountains. Roads are slippery.',
    -2.0,
    -8.0,
    15.0,
    20.0,
    ARRAY['snow', 'winter', 'mountain'],
    22,
    0,
    'active',
    NOW() - INTERVAL '20 minutes'
  );

-- ============================================================================
-- SAMPLE WEATHER ALERTS
-- These are system-generated alerts (user_id is NULL for public alerts)
-- ============================================================================

INSERT INTO weather_alerts (
  user_id,
  location_name,
  latitude,
  longitude,
  alert_type,
  severity,
  title,
  description,
  start_time,
  end_time,
  source,
  is_read,
  is_dismissed
) VALUES
  (
    NULL,
    'San Francisco Bay Area',
    37.7749,
    -122.4194,
    'storm',
    'warning',
    'Storm Watch - Bay Area',
    'Strong winds and heavy rain expected this evening. Secure outdoor objects and avoid unnecessary travel.',
    NOW(),
    NOW() + INTERVAL '12 hours',
    'National Weather Service',
    false,
    false
  ),
  (
    NULL,
    'Southern California',
    34.0522,
    -118.2437,
    'heat',
    'severe',
    'Excessive Heat Warning',
    'Dangerously hot conditions with temperatures up to 110°F. Heat illness is possible. Stay hydrated and indoors.',
    NOW(),
    NOW() + INTERVAL '48 hours',
    'National Weather Service',
    false,
    false
  ),
  (
    NULL,
    'Seattle Metro Area',
    47.6062,
    -122.3321,
    'flood',
    'warning',
    'Flood Watch',
    'Heavy rainfall may cause flooding in low-lying areas. Avoid driving through flooded roads.',
    NOW() - INTERVAL '2 hours',
    NOW() + INTERVAL '24 hours',
    'National Weather Service',
    false,
    false
  ),
  (
    NULL,
    'New York City',
    40.7128,
    -74.0060,
    'wind',
    'warning',
    'High Wind Warning',
    'Southwest winds 25 to 35 mph with gusts up to 60 mph expected. Secure loose objects.',
    NOW(),
    NOW() + INTERVAL '8 hours',
    'National Weather Service',
    false,
    false
  ),
  (
    NULL,
    'Denver Metro',
    39.7392,
    -104.9903,
    'snow',
    'severe',
    'Winter Storm Warning',
    'Heavy snow expected. Total snow accumulations of 8 to 14 inches. Travel will be very difficult.',
    NOW() + INTERVAL '2 hours',
    NOW() + INTERVAL '36 hours',
    'National Weather Service',
    false,
    false
  );

-- ============================================================================
-- HELPER QUERIES FOR TESTING
-- ============================================================================

-- After running this seed file, you can test with these queries:

-- View all crowdsource reports with vote counts:
-- SELECT * FROM crowdsource_reports_with_votes ORDER BY created_at DESC;

-- View recent weather alerts:
-- SELECT * FROM weather_alerts WHERE end_time > NOW() ORDER BY severity DESC, created_at DESC;

-- Count reports by type:
-- SELECT report_type, COUNT(*) as count FROM crowdsource_reports GROUP BY report_type;

-- Count alerts by severity:
-- SELECT severity, COUNT(*) as count FROM weather_alerts WHERE end_time > NOW() GROUP BY severity;

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. This seed data creates sample reports and alerts for testing
-- 2. All crowdsource reports have NULL user_id since they're public samples
-- 3. To create reports for specific users, first create user accounts through the app
-- 4. Then you can insert reports with actual user_id values
-- 5. Weather alerts with NULL user_id are "public" alerts visible to everyone
-- 6. User-specific alerts should have a valid user_id

-- ============================================================================
-- RESET DATABASE (DANGEROUS - USE WITH CAUTION!)
-- ============================================================================

-- If you need to clear all data and start fresh, uncomment these lines:
-- WARNING: This will delete ALL data in these tables!

-- DELETE FROM report_votes;
-- DELETE FROM crowdsource_reports;
-- DELETE FROM weather_alerts;
-- DELETE FROM saved_locations;
-- DELETE FROM user_preferences;
-- DELETE FROM profiles;

-- Note: You cannot delete from auth.users here - do that in Supabase dashboard

-- ============================================================================
-- COMPLETION
-- ============================================================================

-- Seed data has been inserted successfully!
-- Your database now has sample crowdsource reports and weather alerts for testing.
