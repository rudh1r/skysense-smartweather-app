import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { celsiusToFahrenheit, type WeatherUnits } from "@/lib/unit-conversions";
import { Thermometer } from "lucide-react";

interface FeelsLikeProps {
  temperature: number; // actual temp in °F
  feelsLike: number; // feels like temp in °F
  heatIndex?: number; // heat index in °F
  windChill?: number; // wind chill in °F
  units: WeatherUnits;
}

export function FeelsLike({ temperature, feelsLike, heatIndex, windChill, units }: FeelsLikeProps) {
  if (temperature === undefined || feelsLike === undefined) {
    return null; // or a loading skeleton
  }

  const displayTemp = units.temperature === 'celsius' ? temperature : celsiusToFahrenheit(temperature);
  const displayFeelsLike = units.temperature === 'celsius' ? Math.round(feelsLike) : celsiusToFahrenheit(feelsLike);
  const displayHeatIndex = heatIndex !== undefined ? (units.temperature === 'celsius' ? Math.round(heatIndex) : celsiusToFahrenheit(heatIndex)) : undefined;
  const displayWindChill = windChill !== undefined ? (units.temperature === 'celsius' ? Math.round(windChill) : celsiusToFahrenheit(windChill)) : undefined;


  const difference = feelsLike - temperature;
  const isWarmer = difference > 0;
  const isCooler = difference < 0;
  
  const getFeelsLikeDescription = () => {
    if (Math.abs(difference) < 3) return 'About the same as actual temperature';
    if (isWarmer) return `Feels ${Math.abs(difference).toFixed(0)}° warmer due to humidity`;
    return `Feels ${Math.abs(difference).toFixed(0)}° cooler due to wind chill`;
  };

  const getTempColor = (temp: number) => {
    if (temp < 32) return 'text-blue-600';
    if (temp < 50) return 'text-sky-600';
    if (temp < 70) return 'text-green-600';
    if (temp < 85) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Thermometer className="h-5 w-5 text-orange-500" />
          <span>Feels Like</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Feels Like */}
        <div className="text-center">
          <div className={`text-6xl font-bold mb-2 ${getTempColor(displayFeelsLike)}`}>
            {displayFeelsLike}°
          </div>
          <p className="text-sm text-muted-foreground mb-1">Feels like temperature</p>
          <p className="text-xs text-muted-foreground px-4">{getFeelsLikeDescription()}</p>
        </div>

        {/* Comparison */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground mb-1">Actual</p>
              <p className="text-2xl font-bold">{displayTemp}°</p>
            </div>
            
            <div className="flex items-center justify-center px-4">
              <div className={`text-2xl ${isWarmer ? 'text-red-500' : isCooler ? 'text-blue-500' : 'text-gray-500'}`}>
                {isWarmer ? '→ +' : isCooler ? '→ -' : '→'}
              </div>
            </div>
            
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground mb-1">Feels Like</p>
              <p className={`text-2xl font-bold ${getTempColor(displayFeelsLike)}`}>{displayFeelsLike}°</p>
            </div>
          </div>
        </div>

        {/* Additional Factors */}
        <div className="grid grid-cols-2 gap-2">
          {displayHeatIndex !== undefined && displayHeatIndex > displayTemp && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Heat Index</p>
              <p className="font-medium text-red-900">{displayHeatIndex}°</p>
            </div>
          )}
          
          {displayWindChill !== undefined && displayWindChill < displayTemp && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Wind Chill</p>
              <p className="font-medium text-blue-900">{displayWindChill}°</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
