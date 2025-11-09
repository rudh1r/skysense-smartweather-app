import { useState, useEffect } from 'react';

interface RealTimeClockProps {
  timezone?: string;
}

export function RealTimeClock({ timezone }: RealTimeClockProps) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const time = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // This will be overridden by locale if not US, but good for consistency
    timeZone: timezone,
  });

  const dayAndDate = new Intl.DateTimeFormat([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  }).format(date);

  return (
    <div className="text-center">
      <p className="text-4xl font-bold tracking-tight text-gray-800 dark:text-white/90">
        {time.replace(' ', '')}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {dayAndDate}
      </p>
    </div>
  );
}