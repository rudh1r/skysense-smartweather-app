import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Umbrella, 
  Sun, 
  Shirt, 
  Car, 
  Coffee, 
  Bike,
  Footprints,
  Wind,
  Eye,
  Droplets,
  Thermometer,
  AlertTriangle
} from "lucide-react";

interface WeatherCondition {
  temperature: number;
  condition: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  visibility: number;
}

interface DailyLifeAdvisorProps {
  weather: WeatherCondition;
}

interface Advice {
  icon: React.ElementType;
  category: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  color: string;
}

// AI-powered smart advisor that analyzes multiple conditions to generate exactly 3 personalized tips
export const generateSmartAdvice = (weather: WeatherCondition): Advice[] => {
    const allAdvice: Advice[] = [];
    let score = 0; // Comfort score to determine overall conditions

    // Analyze precipitation
    if (weather.precipitation >= 70) {
      allAdvice.push({
        icon: Umbrella,
        category: "Rain Protection",
        message: `Heavy rain expected (${weather.precipitation}% chance). Carry umbrella, waterproof jacket, and wear water-resistant footwear to stay dry.`,
        priority: 'high',
        color: 'text-blue-600'
      });
      score -= 15;
    } else if (weather.precipitation >= 40) {
      allAdvice.push({
        icon: Umbrella,
        category: "Rain Watch",
        message: `Moderate rain probability (${weather.precipitation}%). Keep an umbrella handy and plan for possible indoor alternatives.`,
        priority: 'medium',
        color: 'text-blue-500'
      });
      score -= 8;
    } else if (weather.precipitation >= 20) {
      allAdvice.push({
        icon: Umbrella,
        category: "Weather Prep",
        message: `Light showers possible (${weather.precipitation}% chance). Consider keeping a compact umbrella in your bag just in case.`,
        priority: 'low',
        color: 'text-blue-400'
      });
      score -= 3;
    }

    // Analyze temperature and clothing
    if (weather.temperature <= 0) {
      allAdvice.push({
        icon: Shirt,
        category: "Clothing Advice",
        message: `Freezing at ${weather.temperature}°C. Layer up with thermal underwear, heavy winter coat, insulated gloves, warm hat, and scarf. Limit outdoor exposure.`,
        priority: 'high',
        color: 'text-blue-800'
      });
      score -= 20;
    } else if (weather.temperature <= 5) {
      allAdvice.push({
        icon: Shirt,
        category: "Clothing Advice",
        message: `Very cold at ${weather.temperature}°C. Heavy coat, warm layers, winter accessories essential. Warm up vehicles before driving.`,
        priority: 'high',
        color: 'text-blue-700'
      });
      score -= 15;
    } else if (weather.temperature <= 10) {
      allAdvice.push({
        icon: Shirt,
        category: "Clothing Advice",
        message: `Cold day at ${weather.temperature}°C. Winter jacket, sweater, and long pants recommended. Gloves for extended outdoor time.`,
        priority: 'medium',
        color: 'text-blue-600'
      });
      score -= 8;
    } else if (weather.temperature <= 15) {
      allAdvice.push({
        icon: Shirt,
        category: "Clothing Advice",
        message: `Cool at ${weather.temperature}°C. Light jacket or sweater with long sleeves will keep you comfortable throughout the day.`,
        priority: 'medium',
        color: 'text-blue-500'
      });
      score -= 3;
    } else if (weather.temperature <= 25) {
      allAdvice.push({
        icon: Shirt,
        category: "Clothing Advice",
        message: `Pleasant ${weather.temperature}°C weather. T-shirt with a light layer option is perfect for adapting to indoor/outdoor transitions.`,
        priority: 'low',
        color: 'text-green-600'
      });
      score += 10;
    } else if (weather.temperature <= 30) {
      allAdvice.push({
        icon: Shirt,
        category: "Clothing Advice",
        message: `Warm at ${weather.temperature}°C. Light, breathable fabrics like cotton recommended. Shorts and t-shirt for outdoor activities.`,
        priority: 'low',
        color: 'text-orange-500'
      });
      score += 5;
    } else if (weather.temperature <= 35) {
      allAdvice.push({
        icon: Shirt,
        category: "Clothing Advice",
        message: `Hot at ${weather.temperature}°C. Loose, light-colored breathable clothing essential. Sun hat and UV-protection clothing advised.`,
        priority: 'medium',
        color: 'text-red-500'
      });
      score -= 10;
    } else {
      allAdvice.push({
        icon: Shirt,
        category: "Heat Warning",
        message: `Extreme heat at ${weather.temperature}°C. Minimal lightweight clothing. Stay indoors 10 AM-6 PM. Heat stroke risk is serious.`,
        priority: 'high',
        color: 'text-red-700'
      });
      score -= 25;
    }

    // Analyze UV index
    if (weather.uvIndex >= 8) {
      allAdvice.push({
        icon: Sun,
        category: "Sun Protection",
        message: `Very high UV index (${weather.uvIndex}). Apply SPF 50+ sunscreen every 2 hours, wear wide-brimmed hat, UV-blocking sunglasses, and seek shade during peak hours.`,
        priority: 'high',
        color: 'text-orange-600'
      });
      score -= 12;
    } else if (weather.uvIndex >= 6) {
      allAdvice.push({
        icon: Sun,
        category: "Sun Protection",
        message: `High UV index (${weather.uvIndex}). Sunscreen SPF 30+ and sunglasses recommended for outdoor activities. Reapply every 2-3 hours.`,
        priority: 'medium',
        color: 'text-orange-500'
      });
      score -= 5;
    } else if (weather.uvIndex >= 3) {
      allAdvice.push({
        icon: Sun,
        category: "Sun Awareness",
        message: `Moderate UV index (${weather.uvIndex}). Light sun protection advised for extended outdoor time, especially 10 AM-4 PM.`,
        priority: 'low',
        color: 'text-orange-400'
      });
    }

    // Analyze wind conditions
    if (weather.windSpeed >= 30) {
      allAdvice.push({
        icon: Wind,
        category: "Wind Warning",
        message: `Strong winds at ${weather.windSpeed} km/h. Secure outdoor items, avoid cycling, and drive carefully. Tree branches may fall.`,
        priority: 'high',
        color: 'text-gray-700'
      });
      score -= 15;
    } else if (weather.windSpeed >= 20) {
      allAdvice.push({
        icon: Wind,
        category: "Windy Conditions",
        message: `Breezy at ${weather.windSpeed} km/h. Hold onto hats and umbrellas. Consider indoor exercise alternatives if planning outdoor workouts.`,
        priority: 'medium',
        color: 'text-gray-600'
      });
      score -= 5;
    }

    // Wind chill consideration
    if (weather.windSpeed >= 20 && weather.temperature <= 15) {
      allAdvice.push({
        icon: Wind,
        category: "Wind Chill Alert",
        message: `Cold winds make it feel colder than ${weather.temperature}°C. Windproof outer layer essential to prevent wind chill effects.`,
        priority: 'high',
        color: 'text-blue-700'
      });
      score -= 10;
    }

    // Analyze visibility
    if (weather.visibility < 5) {
      allAdvice.push({
        icon: Eye,
        category: "Visibility Alert",
        message: `Poor visibility (${weather.visibility} km). Use headlights while driving, reduce speed, and increase following distance. Fog or haze likely.`,
        priority: 'high',
        color: 'text-yellow-700'
      });
      score -= 12;
    } else if (weather.visibility < 10) {
      allAdvice.push({
        icon: Eye,
        category: "Visibility Notice",
        message: `Reduced visibility (${weather.visibility} km). Drive with caution and use low-beam headlights for safety.`,
        priority: 'medium',
        color: 'text-yellow-600'
      });
      score -= 5;
    }

    // Analyze humidity
    if (weather.humidity >= 80) {
      allAdvice.push({
        icon: Droplets,
        category: "Humidity Alert",
        message: `Very humid at ${weather.humidity}%. Stay hydrated, take breaks in air-conditioned spaces, and avoid strenuous outdoor activities during peak heat.`,
        priority: 'medium',
        color: 'text-blue-500'
      });
      score -= 8;
    } else if (weather.humidity <= 30) {
      allAdvice.push({
        icon: Droplets,
        category: "Dry Air Notice",
        message: `Low humidity at ${weather.humidity}%. Use moisturizer, drink extra water, and consider a humidifier indoors to prevent dry skin and irritation.`,
        priority: 'low',
        color: 'text-orange-400'
      });
      score -= 3;
    }

    // Driving conditions assessment
    if (weather.precipitation >= 50 || weather.visibility < 5) {
      allAdvice.push({
        icon: Car,
        category: "Driving Safety",
        message: `Challenging driving conditions. Allow 20-30% extra travel time, maintain safe distances, and check road conditions before leaving.`,
        priority: 'high',
        color: 'text-red-600'
      });
    } else if (weather.precipitation >= 30 || weather.windSpeed >= 25) {
      allAdvice.push({
        icon: Car,
        category: "Travel Advisory",
        message: `Drive with caution. Wet roads or strong winds may affect vehicle control. Plan for slightly longer commute times.`,
        priority: 'medium',
        color: 'text-yellow-600'
      });
    }

    // Outdoor activity recommendations
    if (weather.temperature >= 15 && weather.temperature <= 25 && weather.precipitation < 30 && weather.windSpeed < 20) {
      allAdvice.push({
        icon: Footprints,
        category: "Outdoor Activities",
        message: `Ideal conditions for outdoor activities! Perfect for walking, jogging, picnics, or sports. Make the most of this beautiful weather.`,
        priority: 'low',
        color: 'text-green-600'
      });
      score += 15;
    } else if (weather.temperature >= 10 && weather.temperature <= 28 && weather.precipitation < 40) {
      allAdvice.push({
        icon: Bike,
        category: "Exercise",
        message: `Good weather for outdoor exercise. Consider cycling, running, or park workouts with appropriate clothing layers.`,
        priority: 'low',
        color: 'text-green-500'
      });
      score += 8;
    }

    // Combined condition warnings
    if (weather.precipitation >= 40 && weather.windSpeed >= 20) {
      allAdvice.push({
        icon: AlertTriangle,
        category: "Storm Conditions",
        message: `Stormy weather with rain and wind. Postpone non-essential outdoor plans. Stay indoors and monitor weather updates.`,
        priority: 'high',
        color: 'text-red-700'
      });
      score -= 20;
    }

    if (weather.temperature >= 30 && weather.humidity >= 70) {
      allAdvice.push({
        icon: Thermometer,
        category: "Heat & Humidity",
        message: `Hot and humid conditions increase heat exhaustion risk. Drink water frequently, take shade breaks, and limit outdoor exertion.`,
        priority: 'high',
        color: 'text-red-600'
      });
      score -= 15;
    }

    // General wellness tip based on overall score
    if (score >= 10) {
      allAdvice.push({
        icon: Coffee,
        category: "Wellness Tip",
        message: `Beautiful day ahead! Perfect time for outdoor activities, meeting friends, or enjoying a cafe patio. Stay mindful of sun protection.`,
        priority: 'low',
        color: 'text-green-600'
      });
    } else if (score <= -15) {
      allAdvice.push({
        icon: Coffee,
        category: "Wellness Tip",
        message: `Challenging weather conditions. Plan indoor activities, check on vulnerable neighbors, and prioritize safety over schedules.`,
        priority: 'medium',
        color: 'text-orange-600'
      });
    } else {
      allAdvice.push({
        icon: Coffee,
        category: "Daily Tip",
        message: `Mixed conditions today. Stay flexible with plans, dress in layers, and keep weather-appropriate gear accessible throughout the day.`,
        priority: 'low',
        color: 'text-blue-500'
      });
    }

    // Sort by priority and select top 3
    const sortedAdvice = allAdvice.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Always return exactly 3 advises
    return sortedAdvice.slice(0, 3);
  };

export function DailyLifeAdvisor({ weather }: DailyLifeAdvisorProps) {
  

  const advice = generateSmartAdvice(weather);

  const priorityBadges = {
    high: "bg-red-500/20 text-red-800 border-red-500/40",
    medium: "bg-yellow-500/20 text-yellow-800 border-yellow-500/40",
    low: "bg-green-500/20 text-green-800 border-green-500/40"
  };

  return (
    <Card className="col-span-full lg:col-span-2 bg-white/80 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <Coffee className="h-5 w-5 text-amber-600" />
            <span>Daily Life Advisor</span>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-800 border-purple-500/40">
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {advice.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white/40 rounded-lg hover:bg-white/60 transition-colors">
              <div className={`p-2 rounded-lg bg-white/60 ${item.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-medium text-sm">{item.category}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${priorityBadges[item.priority]}`}
                  >
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{item.message}</p>
              </div>
            </div>
          );
        })}
        
        {/* AI indicator */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg border border-purple-200/40">
          <p className="text-xs text-center text-gray-600">
            <span className="font-medium">🤖 AI Analysis: </span>
            Recommendations generated from {weather.temperature}°C, {weather.precipitation}% rain chance, UV {weather.uvIndex}, and {weather.windSpeed} km/h wind
          </p>
        </div>
      </CardContent>
    </Card>
  );
}