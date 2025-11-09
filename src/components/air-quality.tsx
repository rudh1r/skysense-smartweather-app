import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { AlertTriangle, Wind } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";

interface AirQualityData {
  aqi: number;
  category: string;
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
    so2: number;
    co: number;
    o3: number;
  };
}

interface AirQualityProps {
  data: AirQualityData;
}

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return "text-green-500";
  if (aqi <= 100) return "text-yellow-500";
  if (aqi <= 150) return "text-orange-500";
  if (aqi <= 200) return "text-red-500";
  if (aqi <= 300) return "text-purple-500";
  return "text-red-800";
};

const getAQIBadgeVariant = (aqi: number) => {
  if (aqi <= 50) return "default";
  if (aqi <= 100) return "secondary";
  if (aqi <= 150) return "outline";
  return "destructive";
};

const pollutantInfo = {
  pm25: { name: "PM2.5", unit: "μg/m³", max: 25 },
  pm10: { name: "PM10", unit: "μg/m³", max: 50 },
  no2: { name: "NO₂", unit: "μg/m³", max: 40 },
  so2: { name: "SO₂", unit: "μg/m³", max: 20 },
  co: { name: "CO", unit: "mg/m³", max: 10 },
  o3: { name: "O₃", unit: "μg/m³", max: 120 }
};

export function AirQuality({ data }: AirQualityProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!data) {
    return null; // or a loading skeleton
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div>
          <Card className="col-span-full lg:col-span-2 h-full bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in cursor-pointer">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Wind className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-gradient">Air Quality Index</span>
                </div>
                <Badge variant={getAQIBadgeVariant(data.aqi)} className={`bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm shadow-sm ${getAQIColor(data.aqi)}`}>
                  {data.category}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* AQI Display */}
              <div className="text-center p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 rounded-2xl border border-blue-200/30 shadow-sm">
                <div className={`text-6xl font-bold mb-3 ${getAQIColor(data.aqi)} drop-shadow-sm animate-float`}>
                  {data.aqi}
                </div>
                <p className="text-muted-foreground font-semibold">AQI Level</p>
                {data.aqi > 100 && (
                  <div className="flex items-center justify-center space-x-2 mt-4 p-3 bg-orange-50/80 rounded-xl border border-orange-200/30">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-700">Sensitive groups should limit outdoor activities</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl border-white/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Wind className="h-5 w-5 text-blue-600" />
            </div>
            <span>Pollutant Breakdown</span>
          </DialogTitle>
          <DialogDescription>
            Detailed air quality measurements for individual pollutants
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {Object.entries(data.pollutants || {}).map(([key, value]) => {
            const info = pollutantInfo[key as keyof typeof pollutantInfo];
            const percentage = Math.min((value / info.max) * 100, 100);
            
            return (
              <div key={key} className="group space-y-3 p-4 bg-gradient-to-br from-gray-50/80 to-gray-100/60 rounded-xl border border-gray-200/30 hover:shadow-md transition-all duration-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">{info.name}</span>
                  <span className="text-sm text-muted-foreground font-medium bg-white/60 px-2 py-1 rounded-lg">
                    {value} {info.unit}
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-3 bg-gray-200/50"
                />
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}