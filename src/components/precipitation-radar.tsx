import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CloudRain, Droplet } from "lucide-react";

interface PrecipitationRadarProps {
  chanceOfRain: number; // percentage
  amount?: number; // inches
  nextHour?: number; // percentage
  hourlyChances?: Array<{ time: string; chance: number }>; // hourly forecast
}

export function PrecipitationRadar({ chanceOfRain, amount, nextHour, hourlyChances }: PrecipitationRadarProps) {
  const getRainLevel = (chance: number) => {
    if (chance === 0) return { level: 'No Rain', color: 'bg-gray-500' };
    if (chance < 30) return { level: 'Low', color: 'bg-blue-300' };
    if (chance < 60) return { level: 'Moderate', color: 'bg-blue-500' };
    if (chance < 80) return { level: 'High', color: 'bg-blue-700' };
    return { level: 'Very High', color: 'bg-blue-900' };
  };

  const rainLevel = getRainLevel(chanceOfRain);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <CloudRain className="h-5 w-5 text-blue-500" />
            <span>Precipitation</span>
          </div>
          <Badge className={`${rainLevel.color} text-white`}>{rainLevel.level}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Chance */}
        <div className="text-center">
          <div className="text-5xl font-bold mb-1">{chanceOfRain}%</div>
          <p className="text-sm text-muted-foreground">Chance of rain today</p>
        </div>

        {/* Next Hour */}
        {nextHour !== undefined && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Next hour</p>
              <p className="font-medium text-blue-900">{nextHour}%</p>
            </div>
          </div>
        )}

        {/* Expected Amount */}
        {amount !== undefined && amount > 0 && (
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-sky-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Droplet className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Expected amount</span>
            </div>
            <span className="font-medium text-blue-900">{amount}" in</span>
          </div>
        )}

        {/* Hourly Breakdown */}
        {hourlyChances && hourlyChances.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Next 6 hours</p>
            <div className="space-y-1.5">
              {hourlyChances.slice(0, 6).map((hour, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground w-12">{hour.time}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getRainLevel(hour.chance).color} transition-all duration-500`}
                      style={{ width: `${hour.chance}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-10 text-right">{hour.chance}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
