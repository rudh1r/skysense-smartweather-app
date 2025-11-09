import { useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css';
import { AuthProvider, useAuth } from "./components/auth-context";
import { WelcomeScreen } from "./components/welcome-screen";
import { SignInScreen } from "./components/signin-screen";
import { ContentHeader } from "./components/content-header";
import { WeatherBackground } from "./components/weather-background";
import { CurrentWeather } from "./components/current-weather";
import { SevenDayForecast } from "./components/seven-day-forecast";
import { HourlyForecast } from "./components/hourly-forecast";
import { AirQuality } from "./components/air-quality";
import { WeatherMap } from "./components/weather-map";
import { DisasterAlerts } from "./components/disaster-alerts";
import { MicroclimateCrowdsourcing } from "./components/microclimate-crowdsourcing";
import { BottomNavigation } from "./components/bottom-navigation";
import { SidebarNavigation } from "./components/sidebar-navigation";
import { AdvisorsSection } from "./components/advisors-section";
import { SettingsProvider, useSettings } from "./components/settings-context";
import { SettingsSection } from "./components/settings-section";
import { MyProfileSection } from "./components/my-profile-section";
import { SavedLocationsSection } from "./components/saved-locations-section";
import { NotificationsSection } from "./components/notifications-section";
import { LocationPermissionDialog } from "./components/location-permission-dialog";
import { SunriseSunset } from "./components/sunrise-sunset";
import { UVIndex } from "./components/uv-index";
import { WindDetails } from "./components/wind-details";
import { HumidityPressure } from "./components/humidity-pressure";
import { PrecipitationRadar } from "./components/precipitation-radar";
import { FeelsLike } from "./components/feels-like";
import { getCrowdsourceReports, getWeatherAlerts as getDisasterAlerts } from "@/lib/db-operations";
import { Loader2 } from "lucide-react";
import { type WeatherUnits } from "@/lib/unit-conversions";
import {
  getCurrentWeather as fetchCurrentWeather,
  getDailyForecast as fetchSevenDayForecast,
  getHourlyForecast as fetchHourlyForecast,
  getAirQuality as fetchAirQuality,
  searchLocations,
} from "@/lib/weather-api";

function AppContent() {
  const { user, isAuthenticated, isLoading, hasCompletedOnboarding, completeOnboarding } = useAuth();
  const { units, setUnits } = useSettings();
  const [currentLocation, setCurrentLocation] = useState<{ name: string, lat: number, lng: number } | null>(null);
  
  const [activeSection, setActiveSection] = useState('home');
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  
  // Weather data states
  const [weatherData, setWeatherData] = useState<any>({
    current: { condition: 'Sunny' },
    hourly: [],
    daily: [],
    airQuality: {
      aqi: 0,
      category: 'Good',
      pollutants: {}
    },
  });
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('skysense-sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('skysense-sidebar-collapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);



  // Keyboard shortcut to toggle sidebar (Ctrl/Cmd + B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarCollapsed]);

  // Initialize app on mount
  useEffect(() => {
    if (!hasCompletedOnboarding) {
      completeOnboarding();
    }

    const hasLocationPermission = localStorage.getItem('skysense-location-permission');
    const savedLocation = localStorage.getItem('skysense-saved-location');
    
    if (savedLocation) { // A location is saved, use it
      try {
        handleLocationSearch(JSON.parse(savedLocation));
      } catch (error) {
        // Handle old string-based saved location
        console.error("Failed to parse saved location, falling back to permission check:", error);
        if (hasLocationPermission !== 'denied') {
          setShowLocationDialog(true);
        }
      }
    } else if (hasLocationPermission !== 'denied') { // No saved location, ask for permission
      setShowLocationDialog(true);
    } else {
      // Use default location if permission denied and nothing saved
      handleLocationSearch({ name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 });
    }
  }, [hasCompletedOnboarding, completeOnboarding]);

  // Fetch weather data when location changes
  useEffect(() => {
    const fetchAllWeatherData = async (lat: number, lon: number) => {
      setIsWeatherLoading(true);
      setWeatherError(null);
      try {
        const [current, hourly, daily, aq] = await Promise.all([
          fetchCurrentWeather(lat, lon),
          fetchHourlyForecast(lat, lon),
          fetchSevenDayForecast(lat, lon),
          fetchAirQuality(lat, lon),
        ]);

        setWeatherData({
          current: current as any,
          hourly: hourly as any,
          daily: daily as any,
          airQuality: aq as any,
        });
      } catch (error: any) {
        console.error("Failed to fetch weather data:", error);
        setWeatherError("Could not load weather data. Please try again later.");
      } finally {
        setIsWeatherLoading(false);
      }
    };

    if (currentLocation?.lat && currentLocation?.lng) {
      fetchAllWeatherData(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation]);

  // Save location to local storage whenever it changes
  useEffect(() => {
    if (currentLocation) {
      localStorage.setItem('skysense-saved-location', JSON.stringify(currentLocation));
    }
  }, [currentLocation]);

  // When authentication state changes, hide the sign-in screen
  useEffect(() => {
    if (isAuthenticated) {
      setShowSignIn(false);
    }

    // After a user logs in, always redirect to the home page.
    // We check if the user object is present to avoid running this on initial load
    // when the user is already authenticated.
    if (isAuthenticated && user) {
      setActiveSection('home');
    }
  }, [isAuthenticated]);
  
  const handleLocationAllow = (locationName: string, coords: { lat: number; lng: number }) => {
    const newLocation = { name: locationName, lat: coords.lat, lng: coords.lng };
    setCurrentLocation(newLocation);
    // Save to localStorage so we don't ask again
    localStorage.setItem('skysense-saved-location', JSON.stringify(newLocation));
    localStorage.setItem('skysense-location-permission', 'granted');
    setShowLocationDialog(false);
  };
  
  const handleLocationDeny = () => {
    // Save denial preference
    localStorage.setItem('skysense-location-permission', 'denied');
    setShowLocationDialog(false);
  };
  
  const handleLocationSearch = (location: { name: string, lat: number, lng: number }) => {
    setCurrentLocation(location);
    localStorage.setItem('skysense-saved-location', JSON.stringify(location));
  };

  const handleSubmitWeatherReport = (report: any) => {
    // This is a mock implementation
    const newReport = { // eslint-disable-line @typescript-eslint/no-unused-vars
      ...report,
      id: `report-${Date.now()}`,
      timestamp: new Date().toISOString(),
      likes: 0,
      isVerified: false
    };
  };

  const isShowingAuth = showSignIn && !isAuthenticated;

  const renderMainContent = () => {
    const marginLeft = isSidebarCollapsed ? 'md:ml-20' : 'md:ml-[20rem]';
    const sharedContainerClass = `mx-auto px-4 py-6 pb-20 md:pb-6 ${marginLeft} md:pr-4 max-w-none transition-all duration-300`;
    const homeContainerClass = `mx-auto px-4 py-6 pb-20 md:pb-6 ${marginLeft} md:pr-4 max-w-none transition-all duration-300`;

    switch (activeSection) {
      case 'advisors':
        return (
          <div className={sharedContainerClass}>
            {/* Content Header */}
            <ContentHeader
              currentLocation={currentLocation?.name || "Loading..."}
              onLocationChange={handleLocationSearch}
            />
            
            <AdvisorsSection 
              dailyLifeWeather={{
                temperature: weatherData.current.temperature,
                condition: weatherData.current.condition,
                precipitation: weatherData.daily[0]?.precipitation || 0,
                humidity: weatherData.current.humidity,
                windSpeed: weatherData.current.windSpeed,
                uvIndex: weatherData.current.uvIndex,
                visibility: weatherData.current.visibility
              }}
              healthWeather={{
                temperature: weatherData.current.temperature,
                humidity: weatherData.current.humidity,
                aqi: weatherData.airQuality.aqi,
                uvIndex: weatherData.current.uvIndex,
                pollen: { tree: 3, grass: 7, weed: 2, overall: 6 } // Example pollen data
              }}
            />
          </div>
        );
      
      case 'community':
        return (
          <div className={sharedContainerClass}>
            {/* Content Header */}
            <ContentHeader
              currentLocation={currentLocation?.name || "Loading..."}
              onLocationChange={handleLocationSearch}
            />
            
            <MicroclimateCrowdsourcing 
              onSignInClick={() => setShowSignIn(true)}
            />
          </div>
        );

      case 'settings':
        return (
          <div className={sharedContainerClass}>
            {/* Content Header */}
            <ContentHeader
              currentLocation={currentLocation?.name || "Loading..."}
              onLocationChange={handleLocationSearch}
            />
            
            <MyProfileSection 
              currentLocation={currentLocation?.name || "Loading..."}
              user={user}
              onLocationChange={handleLocationSearch}
              onSignInClick={() => setShowSignIn(true)}
            />
          </div>
        );
      
      case 'saved-locations':
        return (
          <div className={sharedContainerClass}>
            {/* Content Header */}
            <ContentHeader
              currentLocation={currentLocation?.name || "Loading..."}
              onLocationChange={handleLocationSearch}
            />
            
            <SavedLocationsSection 
            />
          </div>
        );
      
      case 'notifications':
        return (
          <div className={sharedContainerClass}>
            {/* Content Header */}
            <ContentHeader
              currentLocation={currentLocation?.name || "Loading..."}
              onLocationChange={handleLocationSearch}
            />
            
            <NotificationsSection 
            />
          </div>
        );
      
      default: // 'home'
        return (
          <div className={homeContainerClass}>
            {/* Content Header */}
            <ContentHeader
              currentLocation={currentLocation?.name || "Loading..."}
              onLocationChange={handleLocationSearch}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
              {/* Current Weather - Full width on mobile, 1 col on md, 2 cols on lg, 3 cols on xl */}
              <div className="md:col-span-1 lg:col-span-2 xl:col-span-3">
                <CurrentWeather data={weatherData.current} units={units} />
              </div>
              
              {/* Air Quality - Full width on mobile, 1 col on md, 2 cols on lg, 3 cols on xl */}
              <div className="md:col-span-1 lg:col-span-2 xl:col-span-3">
                <AirQuality data={weatherData.airQuality} />
              </div>
              
              {/* Weather Map - Full width on mobile, 1 col on md, 2 cols on lg, 3 cols on xl */}
              <div className="md:col-span-1 lg:col-span-2 xl:col-span-3">
                <WeatherMap currentLocation={currentLocation} />
              </div>
              
              {/* Hourly Forecast (24hr) - Full width on mobile, 1 col on md, 2 cols on lg, 3 cols on xl */}
              <div className="md:col-span-1 lg:col-span-2 xl:col-span-3 h-full">
                <HourlyForecast 
                  data={weatherData.hourly}
                  units={units}
                />
              </div>

              {/* 7-Day Forecast - Full width on mobile, full width on md, 4 cols on lg, full width on xl */}
              <div className="md:col-span-2 lg:col-span-4 xl:col-span-6">
                <SevenDayForecast data={weatherData.daily} units={units} />
              </div>

              {/* Sunrise/Sunset - 1 col on all sizes */}
              <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
                <SunriseSunset
                  sunrise={weatherData.current.sunrise}
                  sunset={weatherData.current.sunset}
                  currentTime="2:30 PM"
                />
              </div>

              {/* UV Index - 1 col on all sizes */}
              <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
                <UVIndex uvIndex={weatherData.current.uvIndex} />
              </div>

              {/* Feels Like - 1 col on all sizes */}
              <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
                <FeelsLike 
                  temperature={weatherData.current.temperature}
                  feelsLike={weatherData.current.feelsLike}
                  heatIndex={weatherData.current.heatIndex}
                  units={units}
                />
              </div>

              {/* Wind Details - 1 col on all sizes */}
              <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
                <WindDetails 
                  speed={weatherData.current.windSpeed}
                  direction={weatherData.current.windDirection}
                  gusts={weatherData.current.windGust}
                  units={units}
                />
              </div>

              {/* Humidity & Pressure - 1 col on all sizes */}
              <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
                <HumidityPressure 
                  humidity={weatherData.current.humidity}
                  pressure={weatherData.current.pressure}
                  dewPoint={weatherData.current.dewPoint}
                  visibility={weatherData.current.visibility}
                  units={units}
                />
              </div>

              {/* Precipitation Radar - 1 col on all sizes */}
              <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
                <PrecipitationRadar 
                  chanceOfRain={30}
                  amount={weatherData.current.precipitationVolume}
                  nextHour={15}
                  hourlyChances={[
                    { time: '1PM', chance: 15 },
                    { time: '2PM', chance: 20 },
                    { time: '3PM', chance: 30 },
                    { time: '4PM', chance: 45 },
                    { time: '5PM', chance: 60 },
                    { time: '6PM', chance: 40 }
                  ]}
                />
              </div>
            </div>
          </div>
        );
    }
  }; 

  // Show sign-in screen (accessible from sidebar)
  if (isShowingAuth) {
    return (
      <SignInScreen 
        onBack={() => {
          setShowSignIn(false);
        }} 
      />
    );
  }

  return (
    <WeatherBackground condition={weatherData.current.condition}>
      {/* Desktop/Tablet Sidebar Navigation */}
      <div className="hidden md:block">
        <SidebarNavigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          alertCount={0} // Replace with real data if available
          reportCount={0} // Replace with real data if available
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onSignInClick={() => setShowSignIn(true)}
          user={user}
        />
      </div>
      
      {renderMainContent()}
      
      {/* Location Permission Dialog */}
      <LocationPermissionDialog 
        isOpen={showLocationDialog}
        onClose={() => setShowLocationDialog(false)}
        onAllow={handleLocationAllow}
        onDeny={handleLocationDeny}
      />
      
      {/* Mobile Bottom Navigation */}
      <div className="block md:hidden">
        <BottomNavigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          alertCount={0} // Replace with real data if available
          reportCount={0} // Replace with real data if available
        />
      </div>
    </WeatherBackground>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
}