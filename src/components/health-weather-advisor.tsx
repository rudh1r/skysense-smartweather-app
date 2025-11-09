import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { 
  Heart, 
  Flower2, 
  Wind, 
  Droplets, 
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

interface HealthWeatherAdvisorProps {
  weather: {
    temperature: number;
    humidity: number;
    aqi: number;
    uvIndex: number;
    pollen: {
      tree: number;
      grass: number;
      weed: number;
      overall: number;
    };
  };
}

interface HealthAlert {
  type: 'allergy' | 'asthma' | 'hydration' | 'heat-stress' | 'uv-danger';
  severity: 'low' | 'moderate' | 'high' | 'very-high';
  title: string;
  message: string;
  icon: React.ElementType;
  color: string;
  recommendations: string[];
}

export function HealthWeatherAdvisor({ weather }: HealthWeatherAdvisorProps) {
  // AI-powered health advisor that analyzes multiple factors and always generates exactly 3 health recommendations
  const generateSmartHealthAdvice = (): HealthAlert[] => {
    const allAlerts: HealthAlert[] = [];
    let healthRiskScore = 0; // Overall health risk assessment

    // Analyze Air Quality Index (AQI)
    if (weather.aqi >= 201) {
      allAlerts.push({
        type: 'asthma',
        severity: 'very-high',
        title: 'Severe Air Quality Crisis',
        message: `AQI ${weather.aqi} - Very unhealthy air. Everyone should avoid outdoor exposure.`,
        icon: Wind,
        color: 'text-purple-700',
        recommendations: [
          'Stay indoors with windows and doors closed',
          'Use air purifiers with HEPA filters',
          'Wear N95/KN95 masks if outdoor exposure unavoidable',
          'Keep rescue medications readily accessible',
          'Monitor air quality updates continuously'
        ]
      });
      healthRiskScore += 40;
    } else if (weather.aqi >= 151) {
      allAlerts.push({
        type: 'asthma',
        severity: 'very-high',
        title: 'Poor Air Quality Alert',
        message: `AQI ${weather.aqi} - Unhealthy air for all groups. Respiratory distress likely.`,
        icon: Wind,
        color: 'text-red-600',
        recommendations: [
          'Avoid all outdoor physical activities',
          'Keep inhaler accessible if asthmatic',
          'Run air purifiers indoors continuously',
          'Consider N95 mask for essential outdoor trips',
          'Close windows and use recirculated AC'
        ]
      });
      healthRiskScore += 30;
    } else if (weather.aqi >= 101) {
      allAlerts.push({
        type: 'asthma',
        severity: 'high',
        title: 'Moderate Air Quality Concern',
        message: `AQI ${weather.aqi} - Sensitive groups should limit outdoor exposure and exertion.`,
        icon: Wind,
        color: 'text-orange-600',
        recommendations: [
          'Limit prolonged outdoor exertion',
          'Children and elderly should reduce outdoor time',
          'Consider indoor exercise alternatives',
          'Monitor symptoms if you have respiratory conditions'
        ]
      });
      healthRiskScore += 15;
    } else if (weather.aqi >= 51) {
      allAlerts.push({
        type: 'asthma',
        severity: 'moderate',
        title: 'Acceptable Air Quality',
        message: `AQI ${weather.aqi} - Generally acceptable, but unusually sensitive people may experience mild effects.`,
        icon: Wind,
        color: 'text-yellow-600',
        recommendations: [
          'People with respiratory conditions should be aware',
          'Consider limiting very prolonged outdoor exertion',
          'Keep windows open for ventilation when possible'
        ]
      });
      healthRiskScore += 5;
    } else {
      allAlerts.push({
        type: 'asthma',
        severity: 'low',
        title: 'Excellent Air Quality',
        message: `AQI ${weather.aqi} - Clean, healthy air perfect for all outdoor activities.`,
        icon: CheckCircle,
        color: 'text-green-600',
        recommendations: [
          'Ideal conditions for outdoor exercise',
          'Perfect day for children to play outside',
          'Excellent time for outdoor activities and sports'
        ]
      });
    }

    // Analyze Pollen Levels
    const maxPollen = Math.max(weather.pollen.tree, weather.pollen.grass, weather.pollen.weed);
    if (weather.pollen.overall >= 8 || maxPollen >= 9) {
      allAlerts.push({
        type: 'allergy',
        severity: 'very-high',
        title: 'Extreme Pollen Alert',
        message: `Pollen ${weather.pollen.overall}/10 - Severe allergy conditions. High risk for all allergy sufferers.`,
        icon: Flower2,
        color: 'text-red-600',
        recommendations: [
          'Stay indoors during peak pollen hours (5-10 AM)',
          'Take allergy medication proactively',
          'Keep all windows closed, use AC with filters',
          'Shower and change clothes after outdoor exposure',
          'Wear wraparound sunglasses to protect eyes',
          'Consider wearing a mask outdoors'
        ]
      });
      healthRiskScore += 25;
    } else if (weather.pollen.overall >= 6 || maxPollen >= 7) {
      allAlerts.push({
        type: 'allergy',
        severity: 'high',
        title: 'High Pollen Levels',
        message: `Pollen ${weather.pollen.overall}/10 - Significant allergy risk. Symptoms likely for sensitive individuals.`,
        icon: Flower2,
        color: 'text-orange-600',
        recommendations: [
          'Take allergy medication before going outside',
          'Limit outdoor activities during morning hours',
          'Keep windows closed and run AC instead',
          'Rinse nasal passages with saline after being outside',
          'Monitor pollen forecasts daily'
        ]
      });
      healthRiskScore += 18;
    } else if (weather.pollen.overall >= 4) {
      allAlerts.push({
        type: 'allergy',
        severity: 'moderate',
        title: 'Moderate Pollen Activity',
        message: `Pollen ${weather.pollen.overall}/10 - Moderate levels may affect allergy-sensitive individuals.`,
        icon: Flower2,
        color: 'text-yellow-600',
        recommendations: [
          'Allergy sufferers should take standard precautions',
          'Consider pre-medication if planning extended outdoor time',
          'Monitor symptoms and adjust activities accordingly'
        ]
      });
      healthRiskScore += 10;
    } else {
      allAlerts.push({
        type: 'allergy',
        severity: 'low',
        title: 'Low Pollen Conditions',
        message: `Pollen ${weather.pollen.overall}/10 - Minimal allergy risk. Great day for outdoor activities.`,
        icon: Flower2,
        color: 'text-green-600',
        recommendations: [
          'Low risk for allergy symptoms today',
          'Enjoy outdoor activities with minimal concern',
          'Good day to open windows for fresh air'
        ]
      });
    }

    // Analyze Temperature Health Impacts
    if (weather.temperature >= 38) {
      allAlerts.push({
        type: 'heat-stress',
        severity: 'very-high',
        title: 'Extreme Heat Emergency',
        message: `${weather.temperature}°C - Life-threatening heat. Extreme risk of heat stroke and exhaustion.`,
        icon: Thermometer,
        color: 'text-red-700',
        recommendations: [
          'Stay indoors in air conditioning - this is critical',
          'Drink water every 15-20 minutes even without thirst',
          'Check on elderly neighbors and vulnerable individuals',
          'Never leave anyone in parked vehicles',
          'Know heat stroke symptoms: confusion, rapid pulse, hot dry skin',
          'Avoid all outdoor activities - postpone to cooler hours'
        ]
      });
      healthRiskScore += 35;
    } else if (weather.temperature >= 35) {
      allAlerts.push({
        type: 'heat-stress',
        severity: 'very-high',
        title: 'Extreme Heat Warning',
        message: `${weather.temperature}°C - Very high risk of heat-related illness. Take immediate precautions.`,
        icon: Thermometer,
        color: 'text-red-600',
        recommendations: [
          'Remain in air-conditioned spaces as much as possible',
          'Drink water continuously throughout the day',
          'Avoid outdoor activities between 10 AM - 6 PM',
          'Wear loose, light-colored, breathable clothing',
          'Watch for heat exhaustion signs: dizziness, nausea, weakness'
        ]
      });
      healthRiskScore += 28;
    } else if (weather.temperature >= 32) {
      allAlerts.push({
        type: 'hydration',
        severity: 'high',
        title: 'High Heat Advisory',
        message: `${weather.temperature}°C - Elevated heat stress risk. Stay hydrated and cool.`,
        icon: Droplets,
        color: 'text-orange-600',
        recommendations: [
          'Increase water intake significantly above normal',
          'Take regular breaks in shade or AC if outdoors',
          'Limit strenuous activities during peak heat hours',
          'Wear sun-protective clothing and apply sunscreen',
          'Monitor for signs of dehydration'
        ]
      });
      healthRiskScore += 20;
    } else if (weather.temperature >= 28) {
      allAlerts.push({
        type: 'hydration',
        severity: 'moderate',
        title: 'Warm Weather Reminder',
        message: `${weather.temperature}°C - Stay hydrated during outdoor activities.`,
        icon: Droplets,
        color: 'text-yellow-600',
        recommendations: [
          'Drink water regularly, especially during exercise',
          'Take breaks in shade during prolonged outdoor time',
          'Apply sunscreen if spending extended time outside'
        ]
      });
      healthRiskScore += 10;
    } else if (weather.temperature <= 0) {
      allAlerts.push({
        type: 'heat-stress',
        severity: 'high',
        title: 'Freezing Cold Warning',
        message: `${weather.temperature}°C - Risk of hypothermia and frostbite. Limit outdoor exposure.`,
        icon: Thermometer,
        color: 'text-blue-700',
        recommendations: [
          'Minimize outdoor exposure time',
          'Dress in multiple layers with waterproof outer layer',
          'Cover all exposed skin - frostbite can occur quickly',
          'Watch for hypothermia signs: shivering, confusion, fatigue',
          'Keep emergency supplies in vehicles'
        ]
      });
      healthRiskScore += 25;
    } else if (weather.temperature <= 5) {
      allAlerts.push({
        type: 'heat-stress',
        severity: 'moderate',
        title: 'Cold Weather Advisory',
        message: `${weather.temperature}°C - Risk of cold-related health issues with prolonged exposure.`,
        icon: Thermometer,
        color: 'text-blue-600',
        recommendations: [
          'Dress warmly in layers before going outside',
          'Protect extremities with gloves, warm socks, hat',
          'Limit time outdoors for vulnerable individuals',
          'Stay dry to prevent rapid heat loss'
        ]
      });
      healthRiskScore += 15;
    }

    // Analyze UV Index Health Impact
    if (weather.uvIndex >= 11) {
      allAlerts.push({
        type: 'uv-danger',
        severity: 'very-high',
        title: 'Extreme UV Radiation',
        message: `UV Index ${weather.uvIndex} - Extreme risk. Unprotected skin can burn in minutes.`,
        icon: AlertTriangle,
        color: 'text-purple-700',
        recommendations: [
          'Avoid sun exposure between 10 AM - 4 PM if possible',
          'Apply SPF 50+ broad-spectrum sunscreen every 90 minutes',
          'Wear UV-protective clothing with UPF 50+ rating',
          'Use wide-brimmed hat and UV-400 sunglasses',
          'Seek shade whenever possible outdoors'
        ]
      });
      healthRiskScore += 30;
    } else if (weather.uvIndex >= 8) {
      allAlerts.push({
        type: 'uv-danger',
        severity: 'high',
        title: 'Very High UV Exposure',
        message: `UV Index ${weather.uvIndex} - High risk of skin and eye damage without protection.`,
        icon: AlertTriangle,
        color: 'text-red-600',
        recommendations: [
          'Apply SPF 30+ sunscreen generously and reapply every 2 hours',
          'Wear protective clothing, hat, and UV-blocking sunglasses',
          'Seek shade during peak sun hours (10 AM - 4 PM)',
          'Be extra cautious near water, sand, and snow (reflection)'
        ]
      });
      healthRiskScore += 20;
    } else if (weather.uvIndex >= 6) {
      allAlerts.push({
        type: 'uv-danger',
        severity: 'moderate',
        title: 'High UV Index',
        message: `UV Index ${weather.uvIndex} - Moderate to high risk. Sun protection recommended.`,
        icon: AlertTriangle,
        color: 'text-orange-600',
        recommendations: [
          'Use SPF 30+ sunscreen for extended outdoor activities',
          'Wear sunglasses and consider a hat',
          'Take shade breaks during midday hours'
        ]
      });
      healthRiskScore += 12;
    } else if (weather.uvIndex >= 3) {
      allAlerts.push({
        type: 'uv-danger',
        severity: 'low',
        title: 'Moderate UV Levels',
        message: `UV Index ${weather.uvIndex} - Some protection needed for extended sun exposure.`,
        icon: Info,
        color: 'text-yellow-600',
        recommendations: [
          'Wear sunscreen if planning to be outside for over an hour',
          'Sunglasses recommended for eye protection',
          'Most people safe for moderate outdoor activity'
        ]
      });
      healthRiskScore += 5;
    }

    // Combined risk assessments
    if (weather.temperature >= 30 && weather.humidity >= 70) {
      allAlerts.push({
        type: 'heat-stress',
        severity: 'very-high',
        title: 'Heat Index Warning',
        message: `${weather.temperature}°C + ${weather.humidity}% humidity - Feels significantly hotter. High heat stress risk.`,
        icon: Thermometer,
        color: 'text-red-700',
        recommendations: [
          'Heat index increases heat exhaustion risk dramatically',
          'Double your normal water intake',
          'Avoid all strenuous outdoor activities',
          'Stay in air-conditioned environments',
          'Check on vulnerable family members and neighbors'
        ]
      });
      healthRiskScore += 30;
    }

    if (weather.aqi >= 101 && weather.pollen.overall >= 6) {
      allAlerts.push({
        type: 'allergy',
        severity: 'very-high',
        title: 'Air Quality + Pollen Alert',
        message: 'Poor air quality combined with high pollen creates severe respiratory risk.',
        icon: AlertTriangle,
        color: 'text-red-700',
        recommendations: [
          'Stay indoors with windows closed and air purification',
          'Those with asthma/allergies should be extremely cautious',
          'Have medications readily accessible',
          'Consider N95 masks if outdoor exposure necessary',
          'Monitor symptoms closely and seek help if worsening'
        ]
      });
      healthRiskScore += 35;
    }

    // Wellness recommendations based on overall health risk
    if (healthRiskScore >= 30) {
      allAlerts.push({
        type: 'hydration',
        severity: 'high',
        title: 'High Health Risk Day',
        message: 'Multiple health factors require extra caution today. Prioritize safety.',
        icon: Heart,
        color: 'text-red-600',
        recommendations: [
          'Postpone non-essential outdoor plans',
          'Check in regularly with vulnerable family members',
          'Keep emergency contacts accessible',
          'Monitor health symptoms throughout the day',
          'Have necessary medications readily available'
        ]
      });
    } else if (healthRiskScore <= 10) {
      allAlerts.push({
        type: 'hydration',
        severity: 'low',
        title: 'Healthy Conditions',
        message: 'Excellent health conditions today. Great day for outdoor wellness activities.',
        icon: CheckCircle,
        color: 'text-green-600',
        recommendations: [
          'Perfect day for outdoor exercise and activities',
          'Good time for park visits or outdoor sports',
          'Enjoy fresh air - open windows at home',
          'Still remember basic sun protection if outdoors extended time'
        ]
      });
    } else {
      allAlerts.push({
        type: 'hydration',
        severity: 'moderate',
        title: 'Moderate Health Considerations',
        message: 'Some health factors to be mindful of. Take standard precautions.',
        icon: Info,
        color: 'text-yellow-600',
        recommendations: [
          'Follow standard health precautions for the conditions',
          'Listen to your body and adjust activities as needed',
          'Stay prepared with water, medications, and sun protection'
        ]
      });
    }

    // Sort by severity and return exactly 3
    const sortedAlerts = allAlerts.sort((a, b) => {
      const severityOrder = { 'very-high': 4, 'high': 3, 'moderate': 2, 'low': 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });

    return sortedAlerts.slice(0, 3);
  };

  const alerts = generateSmartHealthAdvice();
  
  const severityColors = {
    low: 'bg-green-500/20 border-green-500/40 text-green-800',
    moderate: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-800',
    high: 'bg-orange-500/20 border-orange-500/40 text-orange-800',
    'very-high': 'bg-red-500/20 border-red-500/40 text-red-800'
  };

  const getPollenLevel = (value: number) => {
    if (value <= 2) return { level: 'Low', color: 'text-green-600', progress: value * 10 };
    if (value <= 4) return { level: 'Moderate', color: 'text-yellow-600', progress: value * 10 };
    if (value <= 7) return { level: 'High', color: 'text-orange-600', progress: value * 10 };
    return { level: 'Very High', color: 'text-red-600', progress: value * 10 };
  };

  return (
    <Card className="col-span-full lg:col-span-3 bg-white/80 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>Health & Safety Advisor</span>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-800 border-purple-500/40">
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pollen Breakdown */}
        <div className="bg-white/40 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-3 flex items-center space-x-2">
            <Flower2 className="h-4 w-4 text-yellow-600" />
            <span>Pollen Levels Today</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: 'Tree', value: weather.pollen.tree },
              { name: 'Grass', value: weather.pollen.grass },
              { name: 'Weed', value: weather.pollen.weed }
            ].map((item) => {
              const pollenInfo = getPollenLevel(item.value);
              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className={`text-xs font-medium ${pollenInfo.color}`}>
                      {pollenInfo.level}
                    </span>
                  </div>
                  <Progress value={pollenInfo.progress} className="h-2" />
                  <span className="text-xs text-muted-foreground">{item.value}/10</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Health Alerts - Always 3 */}
        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <Alert key={index} className={`${severityColors[alert.severity]} border-l-4 hover:shadow-md transition-shadow`}>
              <Icon className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {alert.severity.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed">{alert.message}</p>
                  
                  {/* Recommendations */}
                  <div className="bg-white/40 rounded p-3 mt-2">
                    <p className="font-medium text-xs mb-2 flex items-center space-x-1">
                      <Info className="h-3 w-3" />
                      <span>AI Recommendations:</span>
                    </p>
                    <ul className="text-xs space-y-1">
                      {alert.recommendations.slice(0, 3).map((rec, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span className="leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          );
        })}

        {/* AI indicator */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg border border-purple-200/40">
          <p className="text-xs text-center text-gray-600">
            <span className="font-medium">🤖 AI Health Analysis: </span>
            Personalized recommendations based on AQI {weather.aqi}, pollen {weather.pollen.overall}/10, UV {weather.uvIndex}, temp {weather.temperature}°C, and humidity {weather.humidity}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}