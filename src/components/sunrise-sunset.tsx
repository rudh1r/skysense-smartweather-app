import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sunrise, Sunset } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SunriseSunsetProps {
  sunrise: string; // e.g., "6:24 AM"
  sunset: string; // e.g., "5:47 PM"
  currentTime?: string; // e.g., "2:30 PM"
}

export function SunriseSunset({ sunrise, sunset, currentTime }: SunriseSunsetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sunPosition, setSunPosition] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Calculate sun position based on current time
    const getSunPosition = () => {
      const now = currentTime ? parseTime(currentTime) : new Date();
      const sunriseTime = parseTime(sunrise);
      const sunsetTime = parseTime(sunset);

      const totalDaylight = sunsetTime.getTime() - sunriseTime.getTime();
      const elapsed = now.getTime() - sunriseTime.getTime();
      
      let position = elapsed / totalDaylight;
      position = Math.max(0, Math.min(1, position)); // Clamp between 0 and 1
      
      return position;
    };

    const position = getSunPosition();
    setSunPosition(position);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw arc path
    const centerY = height - 10;
    const radius = width * 0.4;
    const startX = width * 0.1;
    const endX = width * 0.9;
    const arcWidth = endX - startX;

    // Draw background arc (light gray)
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 3;
    for (let i = 0; i <= 100; i++) {
      const angle = Math.PI - (i / 100) * Math.PI;
      const x = startX + (i / 100) * arcWidth;
      const y = centerY - Math.sin(angle) * radius;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw progress arc (gradient)
    const gradient = ctx.createLinearGradient(startX, 0, endX, 0);
    gradient.addColorStop(0, '#f59e0b');
    gradient.addColorStop(0.5, '#fbbf24');
    gradient.addColorStop(1, '#fb923c');

    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    for (let i = 0; i <= position * 100; i++) {
      const angle = Math.PI - (i / 100) * Math.PI;
      const x = startX + (i / 100) * arcWidth;
      const y = centerY - Math.sin(angle) * radius;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw sun circle at current position
    const sunAngle = Math.PI - position * Math.PI;
    const sunX = startX + position * arcWidth;
    const sunY = centerY - Math.sin(sunAngle) * radius;

    // Sun glow
    const glowGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 12);
    glowGradient.addColorStop(0, '#fbbf24');
    glowGradient.addColorStop(0.5, '#fb923c');
    glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.beginPath();
    ctx.arc(sunX, sunY, 12, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Sun circle
    ctx.beginPath();
    ctx.arc(sunX, sunY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [sunrise, sunset, currentTime]);

  const parseTime = (timeStr: string): Date => {
    if (!timeStr) {
      return new Date();
    }
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    return date;
  };

  const getDaylightDuration = () => {
    if (!sunrise || !sunset) {
      return 'N/A';
    }
    const sunriseTime = parseTime(sunrise);
    const sunsetTime = parseTime(sunset);
    const diff = sunsetTime.getTime() - sunriseTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Sunrise className="h-5 w-5 text-orange-500" />
          <span>Sun & Moon</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sun Arc Visualization */}
        <div className="relative h-32">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Sunrise and Sunset Times */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Sunrise className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sunrise</p>
              <p className="font-medium">{sunrise}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div>
              <p className="text-xs text-muted-foreground text-right">Sunset</p>
              <p className="font-medium text-right">{sunset}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Sunset className="h-4 w-4 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Daylight Duration */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Daylight Duration</p>
          <p className="font-medium text-orange-900">{getDaylightDuration()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
