import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Wind, Navigation } from "lucide-react";

interface WindDetailsProps {
  speed: number; // mph
  direction: number; // degrees
  gusts?: number; // mph
}

export function WindDetails({ speed, direction, gusts }: WindDetailsProps) {
  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const getWindDescription = (speed: number) => {
    if (speed < 1) return 'Calm';
    if (speed < 8) return 'Light breeze';
    if (speed < 13) return 'Gentle breeze';
    if (speed < 19) return 'Moderate breeze';
    if (speed < 25) return 'Fresh breeze';
    if (speed < 32) return 'Strong breeze';
    if (speed < 39) return 'Near gale';
    if (speed < 47) return 'Gale';
    if (speed < 55) return 'Strong gale';
    if (speed < 64) return 'Storm';
    return 'Violent storm';
  };

  const compassDirection = getWindDirection(direction);
  const windDescription = getWindDescription(speed);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Wind className="h-5 w-5 text-blue-500" />
          <span>Wind</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wind Speed */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Speed</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold">{speed}</span>
              <span className="text-sm text-muted-foreground">mph</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{windDescription}</p>
          </div>

          {/* Wind Direction Compass */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center border-2 border-blue-200">
              <Navigation 
                className="h-8 w-8 text-blue-600" 
                style={{ 
                  transform: `rotate(${direction}deg)`,
                  transition: 'transform 0.5s ease'
                }}
              />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="text-xs font-medium text-blue-900">{compassDirection}</div>
            </div>
          </div>
        </div>

        {/* Wind Gusts */}
        {gusts && gusts > speed && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Gusts up to</p>
              <p className="font-medium text-blue-900">{gusts} mph</p>
            </div>
          </div>
        )}

        {/* Direction Details */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-2 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Direction</p>
            <p className="font-medium">{compassDirection}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Degrees</p>
            <p className="font-medium">{direction}°</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
