/**
 * Database Operations
 * Helper functions for common database operations with Supabase
 */

import { supabase } from './supabase';
import type {
  Profile,
  SavedLocation,
  CrowdsourceReport,
  ReportVote,
  UserPreferences,
  WeatherAlert,
} from './supabase';

// ============================================================================
// PROFILE OPERATIONS
// ============================================================================

/**
 * Get user profile by ID
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return data;
}

/**
 * Check if username is available
 */
export async function isUsernameAvailable(username: string, currentUserId?: string): Promise<boolean> {
  let query = supabase
    .from('profiles')
    .select('id')
    .eq('username', username);

  if (currentUserId) {
    query = query.neq('id', currentUserId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error checking username:', error);
    return false;
  }

  return data.length === 0;
}

// ============================================================================
// SAVED LOCATIONS OPERATIONS
// ============================================================================

/**
 * Get all saved locations for a user
 */
export async function getSavedLocations(userId: string): Promise<SavedLocation[]> {
  const { data, error } = await supabase
    .from('saved_locations')
    .select('*')
    .eq('user_id', userId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching saved locations:', error);
    return [];
  }

  return data || [];
}

/**
 * Add a new saved location
 */
export async function addSavedLocation(
  userId: string,
  location: Omit<SavedLocation, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<SavedLocation | null> {
  const { data, error } = await supabase
    .from('saved_locations')
    .insert({
      user_id: userId,
      ...location,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding saved location:', error);
    throw error;
  }

  return data;
}

/**
 * Update a saved location
 */
export async function updateSavedLocation(
  locationId: string,
  updates: Partial<SavedLocation>
): Promise<SavedLocation | null> {
  const { data, error } = await supabase
    .from('saved_locations')
    .update(updates)
    .eq('id', locationId)
    .select()
    .single();

  if (error) {
    console.error('Error updating saved location:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a saved location
 */
export async function deleteSavedLocation(locationId: string): Promise<boolean> {
  const { error } = await supabase
    .from('saved_locations')
    .delete()
    .eq('id', locationId);

  if (error) {
    console.error('Error deleting saved location:', error);
    return false;
  }

  return true;
}

/**
 * Set a location as current
 */
export async function setCurrentLocation(userId: string, locationId: string): Promise<boolean> {
  // First, unset all current locations
  await supabase
    .from('saved_locations')
    .update({ is_current: false })
    .eq('user_id', userId);

  // Then set the selected location as current
  const { error } = await supabase
    .from('saved_locations')
    .update({ is_current: true })
    .eq('id', locationId);

  if (error) {
    console.error('Error setting current location:', error);
    return false;
  }

  return true;
}

// ============================================================================
// CROWDSOURCE REPORTS OPERATIONS
// ============================================================================

/**
 * Get all active crowdsource reports
 */
export async function getCrowdsourceReports(limit = 50): Promise<CrowdsourceReport[]> {
  const { data, error } = await supabase
    .from('crowdsource_reports')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching crowdsource reports:', error);
    return [];
  }

  return data || [];
}

/**
 * Get crowdsource reports near a location
 */
export async function getCrowdsourceReportsNearby(
  latitude: number,
  longitude: number,
  radiusKm = 50,
  limit = 20
): Promise<CrowdsourceReport[]> {
  // Simple bounding box filter (for more accuracy, use PostGIS extensions)
  const latDelta = radiusKm / 111; // Approximate km to degrees
  const lonDelta = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

  const { data, error } = await supabase
    .from('crowdsource_reports')
    .select('*')
    .eq('status', 'active')
    .gte('latitude', latitude - latDelta)
    .lte('latitude', latitude + latDelta)
    .gte('longitude', longitude - lonDelta)
    .lte('longitude', longitude + lonDelta)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching nearby crowdsource reports:', error);
    return [];
  }

  return data || [];
}

/**
 * Create a new crowdsource report
 */
export async function createCrowdsourceReport(
  report: Omit<CrowdsourceReport, 'id' | 'upvotes' | 'downvotes' | 'is_verified' | 'verified_by' | 'verified_at' | 'status' | 'created_at' | 'updated_at'>
): Promise<CrowdsourceReport | null> {
  const { data, error } = await supabase
    .from('crowdsource_reports')
    // The report object now contains the user_id, so we can pass it directly.
    .insert(report)
    .select()
    .single();

  if (error) {
    console.error('Error creating crowdsource report:', error);
    throw error;
  }

  return data;
}

/**
 * Update a crowdsource report
 */
export async function updateCrowdsourceReport(
  reportId: string,
  updates: Partial<CrowdsourceReport>
): Promise<CrowdsourceReport | null> {
  const { data, error } = await supabase
    .from('crowdsource_reports')
    .update(updates)
    .eq('id', reportId)
    .select()
    .single();

  if (error) {
    console.error('Error updating crowdsource report:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a crowdsource report
 */
export async function deleteCrowdsourceReport(reportId: string): Promise<boolean> {
  const { error } = await supabase
    .from('crowdsource_reports')
    .delete()
    .eq('id', reportId);

  if (error) {
    console.error('Error deleting crowdsource report:', error);
    return false;
  }

  return true;
}

// ============================================================================
// REPORT VOTES OPERATIONS
// ============================================================================

/**
 * Vote on a crowdsource report
 */
export async function voteOnReport(
  userId: string,
  reportId: string,
  voteType: 'up' | 'down'
): Promise<boolean> {
  // Check if user already voted
  const { data: existingVote } = await supabase
    .from('report_votes')
    .select('*')
    .eq('report_id', reportId)
    .eq('user_id', userId)
    .single();

  if (existingVote) {
    // Update existing vote
    const { error } = await supabase
      .from('report_votes')
      .update({ vote_type: voteType })
      .eq('report_id', reportId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating vote:', error);
      return false;
    }
  } else {
    // Create new vote
    const { error } = await supabase
      .from('report_votes')
      .insert({
        user_id: userId,
        report_id: reportId,
        vote_type: voteType,
      });

    if (error) {
      console.error('Error creating vote:', error);
      return false;
    }
  }

  // Update vote counts on the report
  await updateReportVoteCounts(reportId);

  return true;
}

/**
 * Remove vote from a report
 */
export async function removeVote(userId: string, reportId: string): Promise<boolean> {
  const { error } = await supabase
    .from('report_votes')
    .delete()
    .eq('report_id', reportId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing vote:', error);
    return false;
  }

  // Update vote counts on the report
  await updateReportVoteCounts(reportId);

  return true;
}

/**
 * Update vote counts on a report
 */
async function updateReportVoteCounts(reportId: string): Promise<void> {
  const { data: votes } = await supabase
    .from('report_votes')
    .select('vote_type')
    .eq('report_id', reportId);

  if (!votes) return;

  const upvotes = votes.filter(v => v.vote_type === 'up').length;
  const downvotes = votes.filter(v => v.vote_type === 'down').length;

  await supabase
    .from('crowdsource_reports')
    .update({ upvotes, downvotes })
    .eq('id', reportId);
}

// ============================================================================
// USER PREFERENCES OPERATIONS
// ============================================================================

/**
 * Get user preferences
 */
export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }

  return data;
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string,
  updates: Partial<UserPreferences>
): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from('user_preferences')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }

  return data;
}

// ============================================================================
// WEATHER ALERTS OPERATIONS
// ============================================================================

/**
 * Get weather alerts for a user
 */
export async function getWeatherAlerts(userId: string): Promise<WeatherAlert[]> {
  const { data, error } = await supabase
    .from('weather_alerts')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`)
    .gte('end_time', new Date().toISOString())
    .order('severity', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching weather alerts:', error);
    return [];
  }

  return data || [];
}

/**
 * Mark alert as read
 */
export async function markAlertAsRead(alertId: string): Promise<boolean> {
  const { error } = await supabase
    .from('weather_alerts')
    .update({ is_read: true })
    .eq('id', alertId);

  if (error) {
    console.error('Error marking alert as read:', error);
    return false;
  }

  return true;
}

/**
 * Dismiss an alert
 */
export async function dismissAlert(alertId: string): Promise<boolean> {
  const { error } = await supabase
    .from('weather_alerts')
    .update({ is_dismissed: true })
    .eq('id', alertId);

  if (error) {
    console.error('Error dismissing alert:', error);
    return false;
  }

  return true;
}

// ============================================================================
// REALTIME SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to crowdsource reports updates
 */
export function subscribeToCrowdsourceReports(
  callback: (payload: any) => void
) {
  return supabase
    .channel('crowdsource_reports')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'crowdsource_reports',
      },
      callback
    )
    .subscribe();
}

/**
 * Subscribe to weather alerts for a user
 */
export function subscribeToWeatherAlerts(
  userId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel('weather_alerts')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'weather_alerts',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}
