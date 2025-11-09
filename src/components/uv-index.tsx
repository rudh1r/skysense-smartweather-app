import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Sun } from "lucide-react";

interface UVIndexProps {
  uvIndex: number;
  maxUV?: number;
}

export function UVIndex({ uvIndex, maxUV = 11 }: UVIndexProps) {
  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: 'bg-green-500', textColor: 'text-green-900', bgColor: 'bg-green-50' };
    if (uv <= 5) return { level: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-900', bgColor: 'bg-yellow-50' };
    if (uv <= 7) return { level: 'High', color: 'bg-orange-500', textColor: 'text-orange-900', bgColor: 'bg-orange-50' };
    if (uv <= 10) return { level: 'Very High', color: 'bg-red-500', textColor: 'text-red-900', bgColor: 'bg-red-50' };
    return { level: 'Extreme', color: 'bg-purple-500', textColor: 'text-purple-900', bgColor: 'bg-purple-50' };
  };

  const getProtectionAdvice = (uv: number) => {
    if (uv <= 2) return 'No protection needed';
    if (uv <= 5) return 'Wear sunscreen if outside for extended periods';
    if (uv <= 7) return 'Protection essential - use sunscreen SPF 30+';
    if (uv <= 10) return 'Extra protection required - avoid sun 10am-4pm';
    return 'Take all precautions - avoid sun exposure';
  };

  const uvLevel = getUVLevel(uvIndex);
  const percentage = (uvIndex / maxUV) * 100;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <span>UV Index</span>
          </div>
          <Badge className={`${uvLevel.color} text-white`}>{uvLevel.level}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* UV Value */}
        <div className="text-center">
          <div className="text-5xl font-bold mb-1">{uvIndex}</div>
          <p className="text-sm text-muted-foreground">out of {maxUV}</p>
        </div>

        {/* UV Bar */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${uvLevel.color} transition-all duration-500`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          {/* UV Scale */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>Extreme</span>
          </div>
        </div>

        {/* Protection Advice */}
        <div className={`${uvLevel.bgColor} p-3 rounded-lg`}>
          <p className={`text-xs ${uvLevel.textColor}`}>{getProtectionAdvice(uvIndex)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
