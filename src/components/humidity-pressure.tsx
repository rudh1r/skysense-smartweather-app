import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Droplets, Gauge, Loader2 } from "lucide-react";

interface HumidityPressureProps {
  humidity?: number; // percentage
  pressure?: number; // inHg
  dewPoint?: number; // °F
  visibility?: number; // miles
}

export function HumidityPressure({ humidity, pressure, dewPoint, visibility }: HumidityPressureProps) {
  const getHumidityLevel = (humidity: number) => {
    if (humidity < 30) return { level: 'Low', color: 'text-orange-600', advice: 'May feel dry' };
    if (humidity < 60) return { level: 'Comfortable', color: 'text-green-600', advice: 'Ideal conditions' };
    if (humidity < 80) return { level: 'High', color: 'text-blue-600', advice: 'May feel humid' };
    return { level: 'Very High', color: 'text-purple-600', advice: 'Very humid' };
  };

  const getPressureTrend = (pressure: number) => {
    if (pressure < 29.80) return { trend: 'Low', icon: '↓', color: 'text-blue-600' };
    if (pressure > 30.20) return { trend: 'High', icon: '↑', color: 'text-orange-600' };
    return { trend: 'Normal', icon: '→', color: 'text-green-600' };
  };

  // Guard clause: If essential data is missing, show a loading state.
  if (humidity === undefined || pressure === undefined) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 h-full flex items-center justify-center">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Droplets className="h-5 w-5 text-blue-500" />
            <span>Humidity & Pressure</span>
          </CardTitle>
        </CardHeader>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    );
  }
  const humidityInfo = getHumidityLevel(humidity);
  const pressureInfo = getPressureTrend(pressure);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Droplets className="h-5 w-5 text-blue-500" />
          <span>Humidity & Pressure</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Humidity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Humidity</p>
            <span className={`text-xs font-medium ${humidityInfo.color}`}>{humidityInfo.level}</span>
          </div>
          
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-3xl font-bold">{humidity}</span>
            <span className="text-muted-foreground">%</span>
          </div>

          {/* Humidity Bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
              style={{ width: `${humidity}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{humidityInfo.advice}</p>
        </div>

        {/* Pressure */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Gauge className="h-4 w-4 text-gray-600" />
              <p className="text-sm text-muted-foreground">Pressure</p>
            </div>
            <span className={`text-xs font-medium ${pressureInfo.color}`}>
              {pressureInfo.icon} {pressureInfo.trend}
            </span>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">{pressure.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">inHg</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {dewPoint !== undefined && (
            <div className="bg-blue-50 p-2 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Dew Point</p>
              <p className="font-medium text-blue-900">{dewPoint}°F</p>
            </div>
          )}
          
          {visibility !== undefined && (
            <div className="bg-gray-50 p-2 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Visibility</p>
              <p className="font-medium">{visibility} mi</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
