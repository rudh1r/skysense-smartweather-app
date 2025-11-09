import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  MapPin, 
  Wind, 
  Droplets, 
  Eye, 
  Gauge,
  TrendingUp,
  TrendingDown,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Zap,
  Maximize2
} from "lucide-react";
import { motion } from "motion/react";

interface DesktopDashboardProps {
  currentWeather: any;
  sevenDayForecast: any[];
  hourlyForecast: any[];
  airQuality: any;
  location: any;
}

export function DesktopDashboard({
  currentWeather,
  sevenDayForecast,
  hourlyForecast,
  airQuality,
  location
}: DesktopDashboardProps) {
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain')) return CloudRain;
    if (lowerCondition.includes('cloud')) return Cloud;
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return Sun;
    return Cloud;
  };

  const WeatherIcon = getWeatherIcon(currentWeather.condition);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Large Current Weather Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="col-span-12 lg:col-span-8"
      >
        <Card className="bg-gradient-to-br from-sky-500 to-teal-500 dark:from-sky-900 dark:to-teal-900 border-white/20 dark:border-sky-800/50 shadow-2xl overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <Cloud className="absolute top-10 right-20 h-64 w-64 text-white" />
            <Sun className="absolute bottom-10 left-20 h-48 w-48 text-white" />
          </div>

          <div className="relative p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Main temperature */}
              <div className="text-white">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6" />
                  <span className="text-xl">{currentWeather.location}</span>
                </div>
                
                <div className="flex items-center gap-6 mb-6">
                  <WeatherIcon className="h-24 w-24 lg:h-32 lg:w-32" />
                  <div>
                    <div className="text-7xl lg:text-8xl font-bold">
                      {currentWeather.temperature}°
                    </div>
                    <p className="text-2xl lg:text-3xl opacity-90 mt-2">
                      {currentWeather.condition}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 text-sm lg:text-base opacity-90">
                  <span>Feels like {currentWeather.feelsLike}°</span>
                  <span>•</span>
                  <span>UV Index: {currentWeather.uvIndex}</span>
                </div>
              </div>

              {/* Right: Weather details grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Wind, label: 'Wind', value: `${currentWeather.windSpeed} km/h`, detail: currentWeather.windDirection },
                  { icon: Droplets, label: 'Humidity', value: `${currentWeather.humidity}%`, detail: 'Normal' },
                  { icon: Gauge, label: 'Pressure', value: `${currentWeather.pressure} mb`, detail: 'Stable' },
                  { icon: Eye, label: 'Visibility', value: `${currentWeather.visibility} km`, detail: 'Excellent' },
                ].map((item, index) => (
                  <Card 
                    key={index}
                    className="bg-white/15 dark:bg-black/20 backdrop-blur-md border-white/20 p-4"
                  >
                    <div className="flex items-center gap-3 mb-2 text-white/80">
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{item.value}</p>
                    <p className="text-sm text-white/70 mt-1">{item.detail}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Stats Column */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="col-span-12 lg:col-span-4 space-y-4"
      >
        {/* Air Quality */}
        <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-white/20 dark:border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Air Quality</h3>
            <Badge variant={airQuality.aqi > 100 ? "destructive" : "secondary"}>
              {airQuality.category}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-primary">{airQuality.aqi}</span>
            <span className="text-muted-foreground">AQI</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(airQuality.aqi, 150) / 1.5}%` }}
            />
          </div>
        </Card>

        {/* 7-Day Preview */}
        <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-white/20 dark:border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">7-Day Forecast</h3>
            <Button variant="ghost" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {sevenDayForecast.slice(0, 3).map((day, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="font-medium">{day.day}</span>
                <div className="flex items-center gap-2">
                  {day.icon === 'sunny' && <Sun className="h-4 w-4 text-yellow-500" />}
                  {day.icon === 'cloudy' && <Cloud className="h-4 w-4 text-gray-500" />}
                  {day.icon === 'rainy' && <CloudRain className="h-4 w-4 text-blue-500" />}
                  {day.icon === 'partly-cloudy' && <Cloud className="h-4 w-4 text-gray-400" />}
                  <span className="font-medium">{day.high}°</span>
                  <span className="text-muted-foreground">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alerts Preview */}
        <Card className="bg-gradient-to-br from-orange-500/90 to-red-500/90 border-white/20 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Active Alert</h3>
              <p className="text-sm opacity-90">Storm Warning</p>
            </div>
          </div>
          <p className="text-sm opacity-90">
            Strong winds expected this evening
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
