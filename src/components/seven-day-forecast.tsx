import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { celsiusToFahrenheit, type WeatherUnits } from "@/lib/unit-conversions";
import { Cloud, CloudRain, Sun, CloudSnow } from "lucide-react";

interface DayForecast {
  day: string;
  date: string;
  condition: string;
  high: number;
  low: number;
  precipitation: number;
  icon: string;
}

interface SevenDayForecastProps {
  data: DayForecast[];
  units: WeatherUnits;
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return <Sun className="h-6 w-6 text-amber-500 drop-shadow-sm" />;
    case 'cloudy':
    case 'partly cloudy':
      return <Cloud className="h-6 w-6 text-slate-500 drop-shadow-sm" />;
    case 'rainy':
    case 'rain':
      return <CloudRain className="h-6 w-6 text-blue-500 drop-shadow-sm" />;
    case 'snow':
      return <CloudSnow className="h-6 w-6 text-sky-300 drop-shadow-sm" />;
    default:
      return <Cloud className="h-6 w-6 text-slate-500 drop-shadow-sm" />;
  }
};

export function SevenDayForecast({ data, units }: SevenDayForecastProps) {
  return (
    <Card className="col-span-full lg:col-span-3 bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-gradient">7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {data.map((day, index) => {
            const displayHigh = units.temperature === 'celsius' ? day.high : celsiusToFahrenheit(day.high);
            const displayLow = units.temperature === 'celsius' ? day.low : celsiusToFahrenheit(day.low);
            
            return (
              <div key={day.date} className="group">
              <div className="flex items-center justify-between py-4 px-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group-hover:shadow-sm">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="p-2 bg-white/60 rounded-lg group-hover:bg-white/80 transition-colors">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{day.day}</p>
                    <p className="text-sm text-muted-foreground">{day.date}</p>
                  </div>
                </div>

                <div className="text-center px-3 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{day.condition}</p>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full opacity-70"></div>
                    <p className="text-xs text-blue-600 font-medium">{day.precipitation}%</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-xl text-gray-900">{displayHigh}°</span>
                    <span className="text-muted-foreground text-lg">{displayLow}°</span>
                  </div>
                </div>
              </div>
                {index < data.length - 1 && <Separator className="bg-gradient-to-r from-transparent via-blue-200/30 to-transparent" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}