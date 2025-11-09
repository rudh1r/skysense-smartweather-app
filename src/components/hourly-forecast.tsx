import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Cloud, CloudRain, Sun, CloudSnow, Droplets } from "lucide-react";

interface HourlyData {
  time: string;
  temperature: number;
  condition: string;
  precipitation: number;
  humidity: number;
}

interface HourlyForecastProps {
  data: HourlyData[];
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return <Sun className="h-4 w-4 text-yellow-500" />;
    case 'cloudy':
    case 'partly cloudy':
      return <Cloud className="h-4 w-4 text-gray-500" />;
    case 'rainy':
    case 'rain':
      return <CloudRain className="h-4 w-4 text-blue-500" />;
    case 'snow':
      return <CloudSnow className="h-4 w-4 text-blue-300" />;
    default:
      return <Cloud className="h-4 w-4 text-gray-500" />;
  }
};

export function HourlyForecast({ data }: HourlyForecastProps) {
  return (
    <Card className="col-span-full lg:col-span-3 h-[550px] sm:h-[600px] flex flex-col bg-white/80 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg">24-Hour Forecast</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-2 pr-4">
            {data.map((hour, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30 hover:bg-white/50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <p className="text-sm w-14">{hour.time}</p>
                  <div className="flex items-center">
                    {getWeatherIcon(hour.condition)}
                  </div>
                  <p className="text-lg w-10">{hour.temperature}°</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Droplets className="h-3 w-3 text-blue-500" />
                    <p className="text-xs text-muted-foreground w-7">{hour.precipitation}%</p>
                  </div>
                  <p className="text-xs text-muted-foreground w-7">{hour.humidity}%</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}