# SkySense Database Documentation

This directory contains all database-related files for the SkySense weather application.

## Files

- **schema.sql** - Complete database schema with tables, indexes, triggers, and RLS policies
- **seed.sql** - Sample data for testing and development

## Database Structure

### Tables Overview

#### 1. `profiles`
Stores user profile information.

**Key Fields:**
- `id` - UUID (references auth.users)
- `email` - User's email address
- `full_name` - User's full name
- `username` - Unique username
- `avatar_url` - Profile picture URL
- `bio` - User biography
- `preferences` - JSON field for additional preferences

**Relationships:**
- One-to-one with auth.users
- One-to-many with saved_locations
- One-to-many with crowdsource_reports

---

#### 2. `saved_locations`
Stores user's saved and favorite locations.

**Key Fields:**
- `id` - UUID (auto-generated)
- `user_id` - References profiles.id
- `name` - Location display name
- `city`, `country`, `state` - Location details
- `latitude`, `longitude` - Coordinates
- `is_current` - Boolean for active location
- `is_favorite` - Boolean for favorites
- `cached_weather_data` - JSON for caching weather

**Use Cases:**
- Save favorite locations
- Quick location switching
- Weather data caching

---

#### 3. `crowdsource_reports`
Stores user-submitted weather observations.

**Key Fields:**
- `id` - UUID (auto-generated)
- `user_id` - References profiles.id (nullable for guest reports)
- `location_name` - Where the report is from
- `latitude`, `longitude` - Report coordinates
- `report_type` - Type: temperature, precipitation, wind, visibility, other
- `condition` - Weather condition description
- `temperature`, `feels_like`, `precipitation_amount`, `wind_speed` - Measurements
- `upvotes`, `downvotes` - Community voting
- `status` - active, archived, flagged, removed

**Features:**
- Community-driven weather reporting
- Voting system for accuracy
- Location-based filtering
- Verification system

---

#### 4. `report_votes`
Tracks user votes on crowdsource reports.

**Key Fields:**
- `id` - UUID (auto-generated)
- `report_id` - References crowdsource_reports.id
- `user_id` - References profiles.id
- `vote_type` - 'up' or 'down'

**Constraints:**
- Unique constraint on (report_id, user_id) - one vote per user per report

---

#### 5. `user_preferences`
Stores user app settings and preferences.

**Key Fields:**
- `id` - UUID (auto-generated)
- `user_id` - References profiles.id (unique)
- `theme` - light, dark, or system
- `temperature_unit` - celsius or fahrenheit
- `wind_speed_unit` - kmh, mph, or ms
- `pressure_unit` - hpa, inhg, or mb
- `precipitation_unit` - mm or in
- `time_format` - 12h or 24h
- `notifications_enabled` - Boolean
- `severe_weather_alerts` - Boolean
- `air_quality_alerts` - Boolean

**Auto-created:**
- Created automatically when user signs up

---

#### 6. `weather_alerts`
Stores severe weather alerts for users.

**Key Fields:**
- `id` - UUID (auto-generated)
- `user_id` - References profiles.id (nullable for public alerts)
- `location_name` - Alert location
- `alert_type` - storm, flood, heat, cold, wind, snow, tornado, hurricane, other
- `severity` - info, warning, severe, extreme
- `title` - Alert title
- `description` - Detailed description
- `start_time`, `end_time` - Alert validity period
- `is_read`, `is_dismissed` - User interaction flags

**Types:**
- User-specific alerts (user_id set)
- Public alerts (user_id is null)

---

## Row Level Security (RLS)

All tables have Row Level Security enabled to ensure users can only access their own data.

### Security Policies

#### Profiles
- ✅ Everyone can view public profile info
- ✅ Users can update only their own profile
- ✅ Automatic profile creation on signup

#### Saved Locations
- ✅ Users can only view/edit/delete their own locations
- ✅ Complete isolation between users

#### Crowdsource Reports
- ✅ Everyone can view active reports
- ✅ Only authenticated users can create reports
- ✅ Users can edit/delete only their own reports

#### Report Votes
- ✅ Everyone can view vote counts
- ✅ Only authenticated users can vote
- ✅ Users can change/remove their own votes

#### User Preferences
- ✅ Users can only view/edit their own preferences
- ✅ Complete privacy

#### Weather Alerts
- ✅ Users can view their own alerts + public alerts
- ✅ Users can mark their own alerts as read/dismissed

---

## Automatic Triggers

### 1. Auto-update `updated_at`
All tables automatically update the `updated_at` timestamp when a row is modified.

### 2. Auto-create Profile
When a new user signs up via Supabase Auth:
- A profile is automatically created in `profiles` table
- Default preferences are created in `user_preferences` table

---

## Indexes

Performance indexes are created on:
- Email lookups (`profiles.email`)
- Username lookups (`profiles.username`)
- User data queries (`*.user_id`)
- Location searches (`saved_locations.latitude`, `saved_locations.longitude`)
- Report filtering (`crowdsource_reports.report_type`, `crowdsource_reports.created_at`)
- Alert severity (`weather_alerts.severity`)

---

## Views

### `crowdsource_reports_with_votes`
Combines reports with their vote counts for easy querying.

**Columns:**
- All fields from `crowdsource_reports`
- `upvote_count` - Total upvotes
- `downvote_count` - Total downvotes

---

## Common Queries

### Get user's saved locations
```sql
SELECT * FROM saved_locations 
WHERE user_id = 'user-uuid-here' 
ORDER BY order_index;
```

### Get recent crowdsource reports
```sql
SELECT * FROM crowdsource_reports_with_votes 
WHERE status = 'active' 
ORDER BY created_at DESC 
LIMIT 20;
```

### Get active weather alerts
```sql
SELECT * FROM weather_alerts 
WHERE end_time > NOW() 
  AND (user_id = 'user-uuid-here' OR user_id IS NULL)
ORDER BY severity DESC, created_at DESC;
```

### Get reports near a location
```sql
SELECT * FROM crowdsource_reports 
WHERE status = 'active'
  AND latitude BETWEEN 37.5 AND 38.0
  AND longitude BETWEEN -122.7 AND -122.2
ORDER BY created_at DESC;
```

---

## Realtime Subscriptions

You can subscribe to real-time updates for:

### Crowdsource Reports
```typescript
supabase
  .channel('crowdsource_reports')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'crowdsource_reports' },
    (payload) => console.log(payload)
  )
  .subscribe();
```

### Weather Alerts
```typescript
supabase
  .channel('weather_alerts')
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'weather_alerts',
      filter: `user_id=eq.${userId}`
    },
    (payload) => console.log(payload)
  )
  .subscribe();
```

---

## Data Validation

### Constraints
- Email must be unique
- Username must be unique (if set)
- Report types are restricted to specific values
- Alert types and severities are restricted
- One vote per user per report

### Check Constraints
- `report_type` ∈ {temperature, precipitation, wind, visibility, other}
- `alert_type` ∈ {storm, flood, heat, cold, wind, snow, tornado, hurricane, other}
- `severity` ∈ {info, warning, severe, extreme}
- `theme` ∈ {light, dark, system}
- `temperature_unit` ∈ {celsius, fahrenheit}

---

## Maintenance

### Reset Database (Development Only)
```sql
DELETE FROM report_votes;
DELETE FROM crowdsource_reports;
DELETE FROM weather_alerts;
DELETE FROM saved_locations;
DELETE FROM user_preferences;
DELETE FROM profiles;
```

⚠️ **Warning:** This will delete all data! Users in `auth.users` must be deleted separately in Supabase dashboard.

---

## Migration Strategy

When making schema changes:

1. Create a new migration file
2. Test in development environment
3. Apply to staging
4. Backup production data
5. Apply to production
6. Verify all policies still work

---

## Performance Tips

1. **Use indexes** - All foreign keys and frequently queried columns are indexed
2. **Limit results** - Always use `LIMIT` for large tables
3. **Cache weather data** - Use `cached_weather_data` in `saved_locations`
4. **Batch operations** - Use bulk inserts/updates when possible
5. **Realtime carefully** - Only subscribe to necessary channels

---

## Security Checklist

- ✅ RLS enabled on all tables
- ✅ Policies prevent unauthorized access
- ✅ Passwords never stored (handled by Supabase Auth)
- ✅ User data isolated per user
- ✅ Public data clearly separated (null user_id)
- ✅ Triggers maintain data integrity
- ✅ Constraints prevent invalid data

---

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Review the schema.sql file for details
3. Check RLS policies in Supabase dashboard
4. Test queries in SQL Editor

---

**Last Updated:** 2025
**Schema Version:** 1.0.0
