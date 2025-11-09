import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { DailyLifeAdvisor, generateSmartAdvice as generateDailyLifeAdvice } from "./daily-life-advisor";
import { HealthWeatherAdvisor, generateSmartHealthAdvice } from "./health-weather-advisor";
import { 
  Lightbulb,
  Heart,
  Coffee,
  Flower2,
  Activity,
  Sun
} from "lucide-react";

interface AdvisorsSectionProps {
  dailyLifeWeather: {
    temperature: number;
    condition: string;
    precipitation: number;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    visibility: number;
  };
  healthWeather: {
    temperature: number;
    humidity: number;
    aqi: number;
    uvIndex: number;
    pollen: {
      tree: number;
      grass: number;
      weed: number;
      overall: number;
    };
  };
}

export function AdvisorsSection({ dailyLifeWeather, healthWeather }: AdvisorsSectionProps) {
  // Get the actual generated advice to accurately count the tips.
  const dailyLifeAlerts = generateDailyLifeAdvice(dailyLifeWeather).length;
  const healthAlerts = generateSmartHealthAdvice(healthWeather).length;

  return (
    <div className="space-y-4 h-full">
      {/* Overview Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <span>Smart Advisors</span>
            </div>
            <div className="flex items-center space-x-2">
              {(dailyLifeAlerts + healthAlerts) > 0 ? (
                <Badge variant="outline" className="bg-orange-500/20 text-orange-800">
                  {dailyLifeAlerts + healthAlerts} active tips
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-green-500/20 text-green-800">
                  All good
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <p className="text-sm text-muted-foreground mb-6">
            Get personalized recommendations based on current weather conditions
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/40 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Coffee className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-sm">Daily Life</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <span className="text-lg font-medium">{dailyLifeAlerts}</span>
                <span className="text-xs text-muted-foreground">tips</span>
              </div>
            </div>
            
            <div className="bg-white/40 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="font-medium text-sm">Health</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <span className="text-lg font-medium">{healthAlerts}</span>
                <span className="text-xs text-muted-foreground">alerts</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Advisors */}
      <Tabs defaultValue="daily-life" className="space-y-4 h-full flex flex-col">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1">
          <TabsList className="grid w-full grid-cols-2 bg-white/40">
            <TabsTrigger value="daily-life" className="flex items-center space-x-2">
              <Coffee className="h-4 w-4" />
              <span>Daily Life</span>
              {dailyLifeAlerts > 0 && (
                <Badge variant="secondary" className="h-5 text-xs ml-1">
                  {dailyLifeAlerts}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Health & Safety</span>
              {healthAlerts > 0 && (
                <Badge variant="secondary" className="h-5 text-xs ml-1">
                  {healthAlerts}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily-life" className="space-y-4 flex-grow">
          <DailyLifeAdvisor weather={dailyLifeWeather} />
          
          {/* Quick Reference Card */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sun className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-sm text-amber-800">Quick Reference</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-amber-700">Temperature:</span>
                  <span className="font-medium ml-1">{dailyLifeWeather.temperature}°C</span>
                </div>
                <div>
                  <span className="text-amber-700">UV Index:</span>
                  <span className="font-medium ml-1">{dailyLifeWeather.uvIndex}/11</span>
                </div>
                <div>
                  <span className="text-amber-700">Rain Chance:</span>
                  <span className="font-medium ml-1">{dailyLifeWeather.precipitation}%</span>
                </div>
                <div>
                  <span className="text-amber-700">Wind:</span>
                  <span className="font-medium ml-1">{dailyLifeWeather.windSpeed} km/h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4 flex-grow">
          <HealthWeatherAdvisor weather={healthWeather} />
          
          {/* Health Quick Reference */}
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-4 w-4 text-red-600" />
                <span className="font-medium text-sm text-red-800">Health Metrics</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-red-700">Air Quality:</span>
                  <span className="font-medium ml-1">{healthWeather.aqi} AQI</span>
                </div>
                <div>
                  <span className="text-red-700">Pollen:</span>
                  <span className="font-medium ml-1">{healthWeather.pollen.overall}/10</span>
                </div>
                <div>
                  <span className="text-red-700">UV Exposure:</span>
                  <span className="font-medium ml-1">{healthWeather.uvIndex}/11</span>
                </div>
                <div>
                  <span className="text-red-700">Humidity:</span>
                  <span className="font-medium ml-1">{healthWeather.humidity}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}