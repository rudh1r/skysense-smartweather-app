/**
 * Weather API Integration
 * Handles all weather data fetching from OpenWeatherMap and other sources
 */

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0';

/**
 * Check if API key is configured
 */
export function isWeatherAPIConfigured(): boolean {
  return !!OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'your-openweather-api-key-here';
}

/**
 * Weather data types
 */
export interface CurrentWeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  feelsLike: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  icon: string;
  timezone?: number;
}

export interface HourlyWeatherData {
  time: string;
  temperature: number;
  condition: string;
  precipitation: number;
  humidity: number;
  icon: string;
}

export interface DailyWeatherData {
  day: string;
  date: string;
  condition: string;
  high: number;
  low: number;
  precipitation: number;
  icon: string;
}

export interface AirQualityData {
  aqi: number;
  category: string;
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
    so2: number;
    co: number;
    o3: number;
  };
}

export interface LocationData {
  name: string;
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
}

/**
 * Fetch current weather data
 */
export async function getCurrentWeather(lat: number, lon: number): Promise<CurrentWeatherData> {
  if (!isWeatherAPIConfigured()) {
    console.warn('Weather API key not configured');
    return getMockCurrentWeather();
  }

  try {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: getWindDirection(data.wind.deg),
      visibility: Math.round(data.visibility / 1000), // Convert to km
      feelsLike: Math.round(data.main.feels_like),
      uvIndex: 0, // UV index requires a different API call
      sunrise: formatTime(new Date(data.sys.sunrise * 1000), data.timezone),
      sunset: formatTime(new Date(data.sys.sunset * 1000), data.timezone),
      icon: data.weather[0].icon,
      timezone: data.timezone,
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return getMockCurrentWeather();
  }
}

/**
 * Fetch hourly forecast (48 hours)
 */
export async function getHourlyForecast(lat: number, lon: number): Promise<HourlyWeatherData[]> {
  if (!isWeatherAPIConfigured()) {
    console.warn('Weather API key not configured');
    return getMockHourlyForecast();
  }

  try {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    return data.list.slice(0, 24).map((item: any) => ({
      time: formatTime(new Date(item.dt * 1000)),
      temperature: Math.round(item.main.temp),
      condition: item.weather[0].main,
      precipitation: Math.round((item.pop || 0) * 100),
      humidity: item.main.humidity,
      icon: item.weather[0].icon,
    }));
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    return getMockHourlyForecast();
  }
}

/**
 * Fetch daily forecast (7-8 days)
 */
export async function getDailyForecast(lat: number, lon: number): Promise<DailyWeatherData[]> {
  if (!isWeatherAPIConfigured()) {
    console.warn('Weather API key not configured');
    return getMockDailyForecast();
  }

  try {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    // Group by day and get min/max temps
    const dailyData: { [key: string]: any } = {};
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toLocaleDateString();
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: date,
          temps: [],
          conditions: [],
          precipitation: [],
          icons: [],
        };
      }
      
      dailyData[dateKey].temps.push(item.main.temp);
      dailyData[dateKey].conditions.push(item.weather[0].main);
      dailyData[dateKey].precipitation.push(item.pop || 0);
      dailyData[dateKey].icons.push(item.weather[0].icon);
    });

    return Object.entries(dailyData).slice(0, 7).map(([_, dayData]: [string, any], index) => {
      const temps = dayData.temps;
      const date = dayData.date;
      
      return {
        day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'long' }),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        condition: getMostFrequent(dayData.conditions),
        high: Math.round(Math.max(...temps)),
        low: Math.round(Math.min(...temps)),
        precipitation: Math.round(Math.max(...dayData.precipitation) * 100),
        icon: getMostFrequent(dayData.icons),
      };
    });
  } catch (error) {
    console.error('Error fetching daily forecast:', error);
    return getMockDailyForecast();
  }
}

/**
 * Fetch air quality data
 */
export async function getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  if (!isWeatherAPIConfigured()) {
    console.warn('Weather API key not configured');
    return getMockAirQuality();
  }

  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Air Quality API error: ${response.status}`);
    }

    const data = await response.json();
    const components = data.list[0].components;
    const aqi = data.list[0].main.aqi;

    return {
      aqi: aqi * 50, // Convert 1-5 scale to 0-250 scale
      category: getAQICategory(aqi),
      pollutants: {
        pm25: components.pm2_5 || 0,
        pm10: components.pm10 || 0,
        no2: components.no2 || 0,
        so2: components.so2 || 0,
        co: components.co || 0,
        o3: components.o3 || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching air quality:', error);
    return getMockAirQuality();
  }
}

/**
 * Search locations by name
 */
export async function searchLocations(query: string): Promise<LocationData[]> {
  if (!isWeatherAPIConfigured()) {
    console.warn('Weather API key not configured');
    return getMockLocations(query);
  }

  try {
    const response = await fetch(
      `${OPENWEATHER_GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    return data.map((location: any) => ({
      name: `${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`,
      city: location.name,
      state: location.state,
      country: location.country,
      latitude: location.lat,
      longitude: location.lon,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return getMockLocations(query);
  }
}

/**
 * Get location from coordinates (reverse geocoding)
 */
export async function getLocationFromCoordinates(lat: number, lon: number): Promise<LocationData | null> {
  if (!isWeatherAPIConfigured()) {
    console.warn('Weather API key not configured');
    return {
      name: 'San Francisco, CA, US',
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      latitude: lat,
      longitude: lon,
    };
  }

  try {
    const response = await fetch(
      `${OPENWEATHER_GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.length === 0) return null;

    const location = data[0];
    return {
      name: `${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`,
      city: location.name,
      state: location.state,
      country: location.country,
      latitude: location.lat,
      longitude: location.lon,
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function formatTime(date: Date, timezoneOffsetSeconds?: number): string {
  if (timezoneOffsetSeconds !== undefined) {
    const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
    const locationTime = new Date(utcTime + (timezoneOffsetSeconds * 1000));
    return locationTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  // Fallback for existing calls without timezone
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getAQICategory(aqi: number): string {
  if (aqi === 1) return 'Good';
  if (aqi === 2) return 'Fair';
  if (aqi === 3) return 'Moderate';
  if (aqi === 4) return 'Poor';
  return 'Very Poor';
}

function getMostFrequent<T>(arr: T[]): T {
  const counts: { [key: string]: number } = {};
  arr.forEach(item => {
    const key = String(item);
    counts[key] = (counts[key] || 0) + 1;
  });
  
  return arr[0]; // Simplified - return first item
}

// ============================================================================
// MOCK DATA (for when API key is not configured)
// ============================================================================

function getMockCurrentWeather(): CurrentWeatherData {
  return {
    location: 'San Francisco, CA',
    temperature: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    pressure: 1013,
    windSpeed: 12,
    windDirection: 'NW',
    visibility: 16,
    feelsLike: 24,
    uvIndex: 6,
    sunrise: '6:42 AM',
    sunset: '7:18 PM',
    icon: '02d',
  };
}

function getMockHourlyForecast(): HourlyWeatherData[] {
  const hours = ['Now', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];
  return hours.map((time, i) => ({
    time,
    temperature: 22 - Math.floor(i / 3),
    condition: i < 4 ? 'Partly Cloudy' : i < 8 ? 'Cloudy' : 'Clear',
    precipitation: i < 4 ? 10 : i < 8 ? 20 : 5,
    humidity: 65 + i,
    icon: '02d',
  }));
}

function getMockDailyForecast(): DailyWeatherData[] {
  const days = ['Today', 'Tomorrow', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday'];
  const dates = ['Sep 19', 'Sep 20', 'Sep 21', 'Sep 22', 'Sep 23', 'Sep 24', 'Sep 25'];
  const conditions = ['Partly Cloudy', 'Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Sunny', 'Cloudy'];
  
  return days.map((day, i) => ({
    day,
    date: dates[i],
    condition: conditions[i],
    high: 22 + (i % 3),
    low: 15 - (i % 2),
    precipitation: i === 3 ? 80 : i % 2 === 0 ? 10 : 25,
    icon: '02d',
  }));
}

function getMockAirQuality(): AirQualityData {
  return {
    aqi: 85,
    category: 'Moderate',
    pollutants: {
      pm25: 18.5,
      pm10: 32.1,
      no2: 25.8,
      so2: 8.2,
      co: 4.1,
      o3: 95.3,
    },
  };
}

function getMockLocations(query: string): LocationData[] {
  const mockCities = [
    { name: 'San Francisco, CA, US', city: 'San Francisco', state: 'CA', country: 'US', latitude: 37.7749, longitude: -122.4194 },
    { name: 'Los Angeles, CA, US', city: 'Los Angeles', state: 'CA', country: 'US', latitude: 34.0522, longitude: -118.2437 },
    { name: 'New York, NY, US', city: 'New York', state: 'NY', country: 'US', latitude: 40.7128, longitude: -74.0060 },
    { name: 'Seattle, WA, US', city: 'Seattle', state: 'WA', country: 'US', latitude: 47.6062, longitude: -122.3321 },
    { name: 'Chicago, IL, US', city: 'Chicago', state: 'IL', country: 'US', latitude: 41.8781, longitude: -87.6298 },
  ];

  return mockCities.filter(city =>
    city.name.toLowerCase().includes(query.toLowerCase())
  );
}