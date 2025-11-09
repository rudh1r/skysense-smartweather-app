/**
 * Supabase Client Configuration
 * This file initializes and exports the Supabase client for use throughout the app
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that environment variables are set
if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL environment variable. ' +
    'Please add it to your .env.local file. ' +
    'See .env.example for reference.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY environment variable. ' +
    'Please add it to your .env.local file. ' +
    'See .env.example for reference.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth options
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    
    // Storage configuration
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    
    // Flow type - use implicit flow for client-side apps
    flowType: 'pkce',
  },
  
  // Global options
  global: {
    headers: {
      'X-Client-Info': 'skysense-weather-app',
    },
  },
  
  // Realtime options (for live updates)
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Database type definitions
 * These match the schema defined in /database/schema.sql
 */

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  location: string | null;
  bio: string | null;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type SavedLocation = {
  id: string;
  user_id: string;
  name: string;
  city: string;
  country: string;
  state: string | null;
  latitude: number;
  longitude: number;
  is_current: boolean;
  is_favorite: boolean;
  order_index: number;
  last_weather_update: string | null;
  cached_weather_data: Record<string, any> | null;
  created_at: string;
  updated_at: string;
};

export type CrowdsourceReport = {
  id: string;
  user_id: string | null;
  username: string | null;
  location_name: string;
  latitude: number;
  longitude: number;
  report_type: 'temperature' | 'precipitation' | 'wind' | 'visibility' | 'other';
  condition: string;
  description: string | null;
  temperature: number | null;
  feels_like: number | null;
  precipitation_amount: number | null;
  wind_speed: number | null;
  visibility: number | null;
  photos: string[];
  tags: string[];
  upvotes: number;
  downvotes: number;
  is_verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  status: 'active' | 'archived' | 'flagged' | 'removed';
  created_at: string;
  updated_at: string;
};

export type ReportVote = {
  id: string;
  report_id: string;
  user_id: string;
  vote_type: 'up' | 'down';
  created_at: string;
};

export type UserPreferences = {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  temperature_unit: 'celsius' | 'fahrenheit';
  wind_speed_unit: 'kmh' | 'mph' | 'ms';
  pressure_unit: 'hpa' | 'inhg' | 'mb';
  precipitation_unit: 'mm' | 'in';
  time_format: '12h' | '24h';
  language: string;
  notifications_enabled: boolean;
  location_tracking: boolean;
  severe_weather_alerts: boolean;
  daily_forecast_alerts: boolean;
  air_quality_alerts: boolean;
  created_at: string;
  updated_at: string;
};

export type WeatherAlert = {
  id: string;
  user_id: string | null;
  location_name: string;
  latitude: number;
  longitude: number;
  alert_type: 'storm' | 'flood' | 'heat' | 'cold' | 'wind' | 'snow' | 'tornado' | 'hurricane' | 'other';
  severity: 'info' | 'warning' | 'severe' | 'extreme';
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  source: string;
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
};

/**
 * Helper function to check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

/**
 * Helper function to get current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * Helper function to get current user's profile
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Export the Supabase client as default
 */
export default supabase;
