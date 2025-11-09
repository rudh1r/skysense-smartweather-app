import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { celsiusToFahrenheit, type WeatherUnits } from "@/lib/unit-conversions";
import { Cloud, Droplets, Wind, Thermometer, Eye, Gauge, Sunrise, Sunset } from "lucide-react";

interface CurrentWeatherProps {
  data: {
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
    sunrise?: string;
    sunset?: string;
  };
  units: WeatherUnits;
}

export function CurrentWeather({ data, units }: CurrentWeatherProps) {
  if (!data || data.temperature === undefined) {
    return null; // or a loading skeleton
  }

  const displayTemp = units.temperature === 'celsius' 
    ? data.temperature 
    : celsiusToFahrenheit(data.temperature);

  return (
    <Card className="col-span-full lg:col-span-2 h-full bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-gradient">Current Weather</span>
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200/50 shadow-sm">
            {data.condition}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-8">
          {/* Main temperature display */}
          <div className="text-center animate-float">
            <div className="text-8xl lg:text-9xl font-extralight mb-3 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              {displayTemp}°
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-lg">Feels like {data.feelsLike}°</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}