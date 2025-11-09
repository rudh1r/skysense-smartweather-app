-- SkySense Database Schema
-- This file creates all necessary tables and security policies for the SkySense weather app

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- Stores user profile information
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  phone_number TEXT,
  date_of_birth DATE,
  location TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);

-- ============================================================================
-- SAVED LOCATIONS TABLE
-- Stores user's saved/favorite locations
-- ============================================================================

CREATE TABLE IF NOT EXISTS saved_locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  last_weather_update TIMESTAMP WITH TIME ZONE,
  cached_weather_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS saved_locations_user_id_idx ON saved_locations(user_id);
CREATE INDEX IF NOT EXISTS saved_locations_coordinates_idx ON saved_locations(latitude, longitude);

-- ============================================================================
-- CROWDSOURCE REPORTS TABLE
-- Stores user-submitted weather observations
-- ============================================================================

CREATE TABLE IF NOT EXISTS crowdsource_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  username TEXT,
  location_name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('temperature', 'precipitation', 'wind', 'visibility', 'other')),
  condition TEXT NOT NULL,
  description TEXT,
  temperature DECIMAL(5, 2),
  feels_like DECIMAL(5, 2),
  precipitation_amount DECIMAL(5, 2),
  wind_speed DECIMAL(5, 2),
  visibility DECIMAL(5, 2),
  photos JSONB DEFAULT '[]'::jsonb,
  tags TEXT[],
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'flagged', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS crowdsource_reports_user_id_idx ON crowdsource_reports(user_id);
CREATE INDEX IF NOT EXISTS crowdsource_reports_location_idx ON crowdsource_reports(latitude, longitude);
CREATE INDEX IF NOT EXISTS crowdsource_reports_type_idx ON crowdsource_reports(report_type);
CREATE INDEX IF NOT EXISTS crowdsource_reports_created_at_idx ON crowdsource_reports(created_at DESC);

-- ============================================================================
-- REPORT VOTES TABLE
-- Tracks user votes on crowdsource reports
-- ============================================================================

CREATE TABLE IF NOT EXISTS report_votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id UUID REFERENCES crowdsource_reports(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(report_id, user_id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS report_votes_report_id_idx ON report_votes(report_id);
CREATE INDEX IF NOT EXISTS report_votes_user_id_idx ON report_votes(user_id);

-- ============================================================================
-- USER PREFERENCES TABLE
-- Stores user app settings and preferences
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  temperature_unit TEXT DEFAULT 'celsius' CHECK (temperature_unit IN ('celsius', 'fahrenheit')),
  wind_speed_unit TEXT DEFAULT 'kmh' CHECK (wind_speed_unit IN ('kmh', 'mph', 'ms')),
  pressure_unit TEXT DEFAULT 'hpa' CHECK (pressure_unit IN ('hpa', 'inhg', 'mb')),
  precipitation_unit TEXT DEFAULT 'mm' CHECK (precipitation_unit IN ('mm', 'in')),
  time_format TEXT DEFAULT '24h' CHECK (time_format IN ('12h', '24h')),
  language TEXT DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  location_tracking BOOLEAN DEFAULT TRUE,
  severe_weather_alerts BOOLEAN DEFAULT TRUE,
  daily_forecast_alerts BOOLEAN DEFAULT FALSE,
  air_quality_alerts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON user_preferences(user_id);

-- ============================================================================
-- WEATHER ALERTS TABLE
-- Stores severe weather alerts for users
-- ============================================================================

CREATE TABLE IF NOT EXISTS weather_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('storm', 'flood', 'heat', 'cold', 'wind', 'snow', 'tornado', 'hurricane', 'other')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'severe', 'extreme')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  source TEXT DEFAULT 'OpenWeatherMap',
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS weather_alerts_user_id_idx ON weather_alerts(user_id);
CREATE INDEX IF NOT EXISTS weather_alerts_severity_idx ON weather_alerts(severity);
CREATE INDEX IF NOT EXISTS weather_alerts_created_at_idx ON weather_alerts(created_at DESC);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger for profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for saved_locations table
DROP TRIGGER IF EXISTS update_saved_locations_updated_at ON saved_locations;
CREATE TRIGGER update_saved_locations_updated_at
  BEFORE UPDATE ON saved_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for crowdsource_reports table
DROP TRIGGER IF EXISTS update_crowdsource_reports_updated_at ON crowdsource_reports;
CREATE TRIGGER update_crowdsource_reports_updated_at
  BEFORE UPDATE ON crowdsource_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_preferences table
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE crowdsource_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_alerts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================

-- Allow users to read all profiles (for usernames, avatars, etc.)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- SAVED LOCATIONS TABLE POLICIES
-- ============================================================================

-- Users can only view their own saved locations
CREATE POLICY "Users can view their own saved locations"
  ON saved_locations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own saved locations
CREATE POLICY "Users can insert their own saved locations"
  ON saved_locations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own saved locations
CREATE POLICY "Users can update their own saved locations"
  ON saved_locations FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own saved locations
CREATE POLICY "Users can delete their own saved locations"
  ON saved_locations FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- CROWDSOURCE REPORTS TABLE POLICIES
-- ============================================================================

-- Everyone can view active crowdsource reports
CREATE POLICY "Active crowdsource reports are viewable by everyone"
  ON crowdsource_reports FOR SELECT
  USING (status = 'active');

-- Only authenticated users can create reports
CREATE POLICY "Authenticated users can create crowdsource reports"
  ON crowdsource_reports FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Users can update their own reports
CREATE POLICY "Users can update their own crowdsource reports"
  ON crowdsource_reports FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reports
CREATE POLICY "Users can delete their own crowdsource reports"
  ON crowdsource_reports FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- REPORT VOTES TABLE POLICIES
-- ============================================================================

-- Everyone can view votes (for counting)
CREATE POLICY "Votes are viewable by everyone"
  ON report_votes FOR SELECT
  USING (true);

-- Only authenticated users can vote
CREATE POLICY "Authenticated users can create votes"
  ON report_votes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Users can update their own votes
CREATE POLICY "Users can update their own votes"
  ON report_votes FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "Users can delete their own votes"
  ON report_votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- USER PREFERENCES TABLE POLICIES
-- ============================================================================

-- Users can only view their own preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own preferences
CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own preferences
CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- WEATHER ALERTS TABLE POLICIES
-- ============================================================================

-- Users can only view their own alerts, or public alerts (user_id IS NULL)
CREATE POLICY "Users can view their own alerts and public alerts"
  ON weather_alerts FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Only system can insert alerts (service_role)
-- Users cannot insert alerts directly

-- Users can update their own alerts (mark as read/dismissed)
CREATE POLICY "Users can update their own alerts"
  ON weather_alerts FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own alerts
CREATE POLICY "Users can delete their own alerts"
  ON weather_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS FOR CLIENT USE
-- ============================================================================

-- Function to create a new user profile when they sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile and preferences on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- HELPER VIEWS (Optional but useful)
-- ============================================================================

-- View for getting report with vote counts
CREATE OR REPLACE VIEW crowdsource_reports_with_votes AS
SELECT 
  cr.*,
  COUNT(CASE WHEN rv.vote_type = 'up' THEN 1 END) as upvote_count,
  COUNT(CASE WHEN rv.vote_type = 'down' THEN 1 END) as downvote_count
FROM crowdsource_reports cr
LEFT JOIN report_votes rv ON cr.id = rv.report_id
GROUP BY cr.id;

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profile information';
COMMENT ON TABLE saved_locations IS 'User saved/favorite locations';
COMMENT ON TABLE crowdsource_reports IS 'User-submitted weather observations';
COMMENT ON TABLE report_votes IS 'Votes on crowdsource reports';
COMMENT ON TABLE user_preferences IS 'User app settings and preferences';
COMMENT ON TABLE weather_alerts IS 'Severe weather alerts for users';

-- ============================================================================
-- COMPLETION
-- ============================================================================

-- All tables, indexes, triggers, and policies have been created successfully!
-- Run this entire file in Supabase SQL Editor to set up your database.
