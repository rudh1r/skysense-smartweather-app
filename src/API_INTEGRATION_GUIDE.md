# SkySense API Integration Guide

This guide shows you how to integrate the backend APIs into your SkySense components.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Weather Data](#weather-data)
4. [Database Operations](#database-operations)
5. [Code Examples](#code-examples)

---

## Getting Started

### Import the necessary libraries

```typescript
// For authentication
import { supabase } from './lib/supabase';
import { signInWithEmail, signUpWithEmail, signOut } from './lib/auth-helpers';

// For weather data
import { getCurrentWeather, getHourlyForecast, getDailyForecast } from './lib/weather-api';

// For database operations
import { 
  getSavedLocations, 
  addSavedLocation,
  getCrowdsourceReports,
  createCrowdsourceReport 
} from './lib/db-operations';
```

---

## Authentication

### Sign Up

```typescript
import { signUpWithEmail } from './lib/auth-helpers';
import { toast } from 'sonner@2.0.3';

const handleSignUp = async (email: string, password: string, fullName: string) => {
  try {
    await signUpWithEmail(email, password, fullName);
    toast.success('Account created! Please check your email to verify.');
  } catch (error: any) {
    toast.error(error.message);
  }
};
```

### Sign In

```typescript
import { signInWithEmail } from './lib/auth-helpers';

const handleSignIn = async (email: string, password: string) => {
  try {
    const { user } = await signInWithEmail(email, password);
    toast.success(`Welcome back, ${user.email}!`);
  } catch (error: any) {
    toast.error('Invalid email or password');
  }
};
```

### Sign In with Google

```typescript
import { signInWithGoogle } from './lib/auth-helpers';

const handleGoogleSignIn = async () => {
  try {
    await signInWithGoogle();
    // User will be redirected to Google OAuth
  } catch (error: any) {
    toast.error('Google sign in failed');
  }
};
```

### Sign Out

```typescript
import { signOut } from './lib/auth-helpers';

const handleSignOut = async () => {
  try {
    await signOut();
    toast.success('Signed out successfully');
  } catch (error: any) {
    toast.error('Error signing out');
  }
};
```

### Check Authentication Status

```typescript
import { useEffect, useState } from 'react';
import { getCurrentUser } from './lib/supabase';

const MyComponent = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    
    loadUser();
  }, []);

  return (
    <div>
      {user ? `Logged in as ${user.email}` : 'Not logged in'}
    </div>
  );
};
```

### Listen to Auth Changes

```typescript
import { useEffect } from 'react';
import { onAuthStateChange } from './lib/auth-helpers';

useEffect(() => {
  const { data: subscription } = onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('User signed in:', session.user);
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
    }
  });

  return () => {
    subscription?.unsubscribe();
  };
}, []);
```

---

## Weather Data

### Get Current Weather

```typescript
import { getCurrentWeather } from './lib/weather-api';

const loadWeather = async (lat: number, lon: number) => {
  const weather = await getCurrentWeather(lat, lon);
  
  console.log(weather.temperature); // 22
  console.log(weather.condition);   // "Partly Cloudy"
  console.log(weather.humidity);    // 65
};
```

### Get Hourly Forecast

```typescript
import { getHourlyForecast } from './lib/weather-api';

const loadHourlyForecast = async (lat: number, lon: number) => {
  const hourly = await getHourlyForecast(lat, lon);
  
  hourly.forEach(hour => {
    console.log(`${hour.time}: ${hour.temperature}°C`);
  });
};
```

### Get Daily Forecast (7 days)

```typescript
import { getDailyForecast } from './lib/weather-api';

const loadDailyForecast = async (lat: number, lon: number) => {
  const daily = await getDailyForecast(lat, lon);
  
  daily.forEach(day => {
    console.log(`${day.day}: High ${day.high}°, Low ${day.low}°`);
  });
};
```

### Get Air Quality

```typescript
import { getAirQuality } from './lib/weather-api';

const loadAirQuality = async (lat: number, lon: number) => {
  const airQuality = await getAirQuality(lat, lon);
  
  console.log(`AQI: ${airQuality.aqi} (${airQuality.category})`);
  console.log(`PM2.5: ${airQuality.pollutants.pm25}`);
};
```

### Search Locations

```typescript
import { searchLocations } from './lib/weather-api';

const handleLocationSearch = async (query: string) => {
  const locations = await searchLocations(query);
  
  locations.forEach(loc => {
    console.log(`${loc.name}: ${loc.latitude}, ${loc.longitude}`);
  });
};
```

---

## Database Operations

### Saved Locations

#### Get User's Saved Locations

```typescript
import { getSavedLocations } from './lib/db-operations';

const loadSavedLocations = async (userId: string) => {
  const locations = await getSavedLocations(userId);
  
  locations.forEach(loc => {
    console.log(`${loc.name}: ${loc.latitude}, ${loc.longitude}`);
  });
};
```

#### Add a Saved Location

```typescript
import { addSavedLocation } from './lib/db-operations';

const handleAddLocation = async (userId: string) => {
  const newLocation = await addSavedLocation(userId, {
    name: 'Home',
    city: 'San Francisco',
    country: 'US',
    state: 'CA',
    latitude: 37.7749,
    longitude: -122.4194,
    is_current: true,
    is_favorite: true,
    order_index: 0,
    last_weather_update: null,
    cached_weather_data: null,
  });
  
  toast.success('Location saved!');
};
```

#### Update a Saved Location

```typescript
import { updateSavedLocation } from './lib/db-operations';

const handleUpdateLocation = async (locationId: string) => {
  await updateSavedLocation(locationId, {
    is_favorite: true,
  });
  
  toast.success('Location updated!');
};
```

#### Delete a Saved Location

```typescript
import { deleteSavedLocation } from './lib/db-operations';

const handleDeleteLocation = async (locationId: string) => {
  const success = await deleteSavedLocation(locationId);
  
  if (success) {
    toast.success('Location deleted!');
  }
};
```

---

### Crowdsource Reports

#### Get All Reports

```typescript
import { getCrowdsourceReports } from './lib/db-operations';

const loadReports = async () => {
  const reports = await getCrowdsourceReports(50); // Get 50 recent reports
  
  reports.forEach(report => {
    console.log(`${report.location_name}: ${report.condition}`);
  });
};
```

#### Get Nearby Reports

```typescript
import { getCrowdsourceReportsNearby } from './lib/db-operations';

const loadNearbyReports = async (lat: number, lon: number) => {
  const reports = await getCrowdsourceReportsNearby(lat, lon, 50, 20);
  // Get reports within 50km radius, max 20 results
  
  console.log(`Found ${reports.length} nearby reports`);
};
```

#### Create a Report

```typescript
import { createCrowdsourceReport } from './lib/db-operations';
import { getCurrentUser } from './lib/supabase';

const handleCreateReport = async () => {
  const user = await getCurrentUser();
  
  if (!user) {
    toast.error('Please sign in to post a report');
    return;
  }
  
  const report = await createCrowdsourceReport(user.id, {
    username: user.email?.split('@')[0] || 'Anonymous',
    location_name: 'Golden Gate Park',
    latitude: 37.7694,
    longitude: -122.4862,
    report_type: 'temperature',
    condition: 'Foggy',
    description: 'Dense fog rolling in from the ocean',
    temperature: 14.5,
    feels_like: 12.0,
    precipitation_amount: null,
    wind_speed: 8.5,
    visibility: null,
    photos: [],
    tags: ['fog', 'morning', 'golden-gate'],
  });
  
  toast.success('Report posted!');
};
```

#### Vote on a Report

```typescript
import { voteOnReport } from './lib/db-operations';

const handleVote = async (userId: string, reportId: string, voteType: 'up' | 'down') => {
  const success = await voteOnReport(userId, reportId, voteType);
  
  if (success) {
    toast.success('Vote recorded!');
  }
};
```

---

### User Preferences

#### Get User Preferences

```typescript
import { getUserPreferences } from './lib/db-operations';

const loadPreferences = async (userId: string) => {
  const prefs = await getUserPreferences(userId);
  
  if (prefs) {
    console.log(`Theme: ${prefs.theme}`);
    console.log(`Temp unit: ${prefs.temperature_unit}`);
  }
};
```

#### Update User Preferences

```typescript
import { updateUserPreferences } from './lib/db-operations';

const handleUpdatePreferences = async (userId: string) => {
  await updateUserPreferences(userId, {
    theme: 'dark',
    temperature_unit: 'fahrenheit',
    notifications_enabled: true,
  });
  
  toast.success('Preferences updated!');
};
```

---

### User Profile

#### Get User Profile

```typescript
import { getProfile } from './lib/db-operations';

const loadProfile = async (userId: string) => {
  const profile = await getProfile(userId);
  
  if (profile) {
    console.log(`Name: ${profile.full_name}`);
    console.log(`Email: ${profile.email}`);
  }
};
```

#### Update User Profile

```typescript
import { updateProfile } from './lib/db-operations';

const handleUpdateProfile = async (userId: string) => {
  await updateProfile(userId, {
    full_name: 'John Doe',
    bio: 'Weather enthusiast',
    location: 'San Francisco, CA',
  });
  
  toast.success('Profile updated!');
};
```

---

## Code Examples

### Complete Sign In Component

```typescript
import { useState } from 'react';
import { signInWithEmail, signInWithGoogle } from './lib/auth-helpers';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { toast } from 'sonner@2.0.3';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signInWithEmail(email, password);
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast.error('Google sign in failed');
    }
  };

  return (
    <form onSubmit={handleEmailSignIn} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
      <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="w-full">
        Sign in with Google
      </Button>
    </form>
  );
}
```

### Complete Weather Component

```typescript
import { useEffect, useState } from 'react';
import { getCurrentWeather, type CurrentWeatherData } from './lib/weather-api';

export function WeatherDisplay() {
  const [weather, setWeather] = useState<CurrentWeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        // Get user's location
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await getCurrentWeather(latitude, longitude);
          setWeather(data);
          setLoading(false);
        });
      } catch (error) {
        console.error('Error loading weather:', error);
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (loading) return <div>Loading weather...</div>;
  if (!weather) return <div>Unable to load weather</div>;

  return (
    <div>
      <h2>{weather.location}</h2>
      <p>{weather.temperature}°C</p>
      <p>{weather.condition}</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind: {weather.windSpeed} km/h {weather.windDirection}</p>
    </div>
  );
}
```

### Complete Crowdsource Report Component

```typescript
import { useState } from 'react';
import { getCurrentUser } from './lib/supabase';
import { createCrowdsourceReport } from './lib/db-operations';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { toast } from 'sonner@2.0.3';

export function ReportForm() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await getCurrentUser();
      
      if (!user) {
        toast.error('Please sign in to post a report');
        return;
      }

      await createCrowdsourceReport(user.id, {
        username: user.email?.split('@')[0] || 'Anonymous',
        location_name: 'Current Location',
        latitude: 37.7749,
        longitude: -122.4194,
        report_type: 'other',
        condition: 'Custom',
        description,
        temperature: null,
        feels_like: null,
        precipitation_amount: null,
        wind_speed: null,
        visibility: null,
        photos: [],
        tags: [],
      });

      toast.success('Report posted successfully!');
      setDescription('');
    } catch (error: any) {
      toast.error('Failed to post report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Describe the current weather conditions..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post Report'}
      </Button>
    </form>
  );
}
```

---

## Next Steps

1. Replace mock data in your components with real API calls
2. Add error handling and loading states
3. Implement caching to reduce API calls
4. Add offline support
5. Test all authentication flows
6. Test database operations with real user data

---

## Important Notes

- Always check if user is authenticated before database operations
- Handle errors gracefully with user-friendly messages
- Use toast notifications for user feedback
- Cache weather data to reduce API calls
- Respect API rate limits (OpenWeatherMap free tier: 1000 calls/day)
- Test with both authenticated and guest users

---

**Happy Coding! 🚀**
