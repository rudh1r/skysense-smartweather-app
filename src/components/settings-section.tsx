import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  Settings, 
  Bell, 
  BellOff, 
  MapPin, 
  Thermometer,
  Shield,
  Smartphone,
  Sun,
  Moon
} from "lucide-react";
import { useState } from "react";

interface SettingsSectionProps {
  currentLocation: string;
  onLocationSearch: (location: string) => void;
}

export function SettingsSection({ 
  currentLocation,
  onLocationSearch 
}: SettingsSectionProps) {
  const [notifications, setNotifications] = useState({
    weatherAlerts: true,
    severeDanger: true,
    dailyForecast: false,
    healthAdvisory: true,
    communityReports: false
  });

  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const requestLocationPermission = () => {
    // Clear the denied status and trigger location dialog again
    localStorage.removeItem('skysense-location-permission');
    localStorage.removeItem('skysense-saved-location');
    
    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          alert('Location permission granted! Please refresh the page to update your location.');
        },
        (error) => {
          alert('Location permission denied or unavailable. You can manually enter your location from the header search.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please manually enter your location from the header search.');
    }
  };

  const activeNotifications = Object.values(notifications).filter(Boolean).length;

  return (
    <Card className="max-w-4xl mx-auto bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl border-white/30 shadow-2xl animate-fade-in">
      <CardHeader className="pb-6 border-b border-white/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Settings className="h-6 w-6 text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-gradient text-2xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Customize your weather app experience and preferences
              </p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200/50 shadow-sm">
            Preferences
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* Display Preferences Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Smartphone className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Display Preferences</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temperature Unit */}
            <div className="p-5 bg-gradient-to-br from-purple-50/80 to-purple-100/60 rounded-2xl border border-purple-200/30">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-purple-600" />
                    <p className="font-semibold text-gray-900">Temperature Unit</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choose between Celsius and Fahrenheit
                  </p>
                </div>
                <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-sm">
                  <Button
                    variant={temperatureUnit === 'celsius' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-9 px-4 text-sm font-medium"
                    onClick={() => setTemperatureUnit('celsius')}
                  >
                    °C
                  </Button>
                  <Button
                    variant={temperatureUnit === 'fahrenheit' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-9 px-4 text-sm font-medium"
                    onClick={() => setTemperatureUnit('fahrenheit')}
                  >
                    °F
                  </Button>
                </div>
              </div>
            </div>

            {/* Theme Selection */}
            <div className="p-5 bg-gradient-to-br from-amber-50/80 to-amber-100/60 rounded-2xl border border-amber-200/30">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-amber-600" />
                  <p className="font-semibold text-gray-900">Theme</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred theme
                </p>
                <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-sm">
                  <Button
                    variant={theme === 'light' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-9 px-3 text-xs"
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="h-3 w-3 mr-1" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-9 px-3 text-xs"
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="h-3 w-3 mr-1" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'auto' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-9 px-3 text-xs"
                    onClick={() => setTheme('auto')}
                  >
                    Auto
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />

        {/* Location Settings */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Location</h3>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50/80 to-emerald-50/60 rounded-2xl border border-green-200/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Current Location</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Weather data for your current area
                  </p>
                </div>
                <Badge className="bg-green-100/80 text-green-700 border-green-300/50">
                  Active
                </Badge>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200/30">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <p className="font-medium text-gray-900">{currentLocation}</p>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                onClick={requestLocationPermission}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Update Location Automatically
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />

        {/* Notification Settings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
            <Badge className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200/50 shadow-sm">
              {activeNotifications} active
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Severe Weather Alerts */}
            <div className="group p-5 bg-gradient-to-br from-red-50/80 to-red-100/60 rounded-2xl border border-red-200/30 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Severe Weather Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Emergency warnings and severe weather notifications
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.severeDanger}
                  onCheckedChange={() => handleNotificationChange('severeDanger')}
                />
              </div>
            </div>

            {/* Weather Alerts */}
            <div className="group p-5 bg-gradient-to-br from-orange-50/80 to-orange-100/60 rounded-2xl border border-orange-200/30 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Weather Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      General weather warnings and watches
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.weatherAlerts}
                  onCheckedChange={() => handleNotificationChange('weatherAlerts')}
                />
              </div>
            </div>

            {/* Health Advisories */}
            <div className="group p-5 bg-gradient-to-br from-emerald-50/80 to-emerald-100/60 rounded-2xl border border-emerald-200/30 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Health Advisories</p>
                    <p className="text-sm text-muted-foreground">
                      Air quality, pollen, and health-related alerts
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.healthAdvisory}
                  onCheckedChange={() => handleNotificationChange('healthAdvisory')}
                />
              </div>
            </div>

            {/* Daily Forecast */}
            <div className="group p-5 bg-gradient-to-br from-blue-50/80 to-blue-100/60 rounded-2xl border border-blue-200/30 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <Sun className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Daily Forecast</p>
                    <p className="text-sm text-muted-foreground">
                      Morning weather summary and daily updates
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.dailyForecast}
                  onCheckedChange={() => handleNotificationChange('dailyForecast')}
                />
              </div>
            </div>

            {/* Community Reports */}
            <div className="group p-5 bg-gradient-to-br from-purple-50/80 to-purple-100/60 rounded-2xl border border-purple-200/30 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                    <Bell className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Community Reports</p>
                    <p className="text-sm text-muted-foreground">
                      Updates from nearby weather reports and community
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.communityReports}
                  onCheckedChange={() => handleNotificationChange('communityReports')}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}