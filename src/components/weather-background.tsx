import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface WeatherBackgroundProps {
  condition: string;
  children: React.ReactNode;
}

const CloudIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <motion.div
    className={`absolute opacity-20 ${className}`}
    style={style}
    animate={{
      x: [0, 30, 0],
      y: [0, -10, 0],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
      <path
        d="M25 45C15 45 7 37 7 27C7 17 15 9 25 9C26 4 31 0 37 0C45 0 52 6 54 14C58 14 62 18 62 23C62 28 58 32 54 32H25C20 32 16 36 16 41C16 46 20 50 25 50H75C83 50 90 43 90 35C90 27 83 20 75 20C74 15 70 11 65 11C60 11 56 15 55 20H25Z"
        fill="currentColor"
      />
    </svg>
  </motion.div>
);

const Star = ({ delay, top, left, size = 2 }: { delay: number; top: string; left: string; size?: number }) => (
  <motion.div
    className="absolute bg-white rounded-full"
    style={{ 
      top, 
      left,
      width: `${size}px`,
      height: `${size}px`
    }}
    animate={{
      opacity: [0.2, 1, 0.2],
      scale: [1, 1.2, 1]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
);

const ShootingStar = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
    style={{ 
      top: `${Math.random() * 40}%`,
      left: `${Math.random() * 100}%`,
      width: '100px',
      transformOrigin: 'left center'
    }}
    initial={{ opacity: 0, x: 0, rotate: -45 }}
    animate={{
      opacity: [0, 1, 0],
      x: [0, 200],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      delay,
      repeatDelay: 20,
      ease: "easeOut"
    }}
  />
);

const RainDrop = ({ delay, left }: { delay: number; left: string }) => (
  <motion.div
    className="absolute w-0.5 bg-blue-400 opacity-40"
    style={{ left, top: "-10px" }}
    animate={{
      y: [0, typeof window !== 'undefined' ? window.innerHeight + 20 : 1000],
      opacity: [0, 0.6, 0]
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      delay,
      ease: "linear"
    }}
  >
    <div className="w-0.5 h-8 bg-gradient-to-b from-blue-400 to-transparent" />
  </motion.div>
);

const SnowFlake = ({ delay, left }: { delay: number; left: string }) => (
  <motion.div
    className="absolute w-2 h-2 bg-white rounded-full opacity-60"
    style={{ left, top: "-10px" }}
    animate={{
      y: [0, typeof window !== 'undefined' ? window.innerHeight + 20 : 1000],
      x: [0, Math.random() * 50 - 25, 0],
      rotate: [0, 360]
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "linear"
    }}
  />
);

const Sun = () => (
  <motion.div
    className="absolute top-20 right-20 w-24 h-24"
    animate={{
      rotate: 360,
      scale: [1, 1.05, 1]
    }}
    transition={{
      rotate: { duration: 30, repeat: Infinity, ease: "linear" },
      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }}
  >
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-yellow-300 rounded-full blur-2xl opacity-50" />
      <div className="absolute inset-2 bg-yellow-400 rounded-full blur-xl opacity-70" />
      <div className="absolute inset-4 bg-yellow-200 rounded-full" />
    </div>
  </motion.div>
);

const Moon = () => (
  <motion.div
    className="absolute top-20 right-20 w-20 h-20"
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-60" />
      <div className="absolute inset-2 bg-blue-50 rounded-full" />
      <div className="absolute top-2 left-3 w-3 h-3 bg-gray-200 rounded-full opacity-40" />
      <div className="absolute top-6 left-8 w-4 h-4 bg-gray-200 rounded-full opacity-30" />
      <div className="absolute top-10 left-4 w-2 h-2 bg-gray-200 rounded-full opacity-35" />
    </div>
  </motion.div>
);

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 7) return 'dawn'; // 5 AM - 7 AM
  if (hour >= 7 && hour < 12) return 'morning'; // 7 AM - 12 PM
  if (hour >= 12 && hour < 17) return 'afternoon'; // 12 PM - 5 PM
  if (hour >= 17 && hour < 19) return 'evening'; // 5 PM - 7 PM
  if (hour >= 19 && hour < 21) return 'dusk'; // 7 PM - 9 PM
  return 'night'; // 9 PM - 5 AM
};

const getWeatherBackground = (condition: string, timeOfDay: string) => {
  const lowerCondition = condition.toLowerCase();
  
  // Night time backgrounds (9 PM - 5 AM)
  if (timeOfDay === 'night') {
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return {
        background: 'linear-gradient(180deg, #0a1128 0%, #1a2332 30%, #2d3561 60%, #3d4f7d 100%)',
        effects: (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Moon />
            {[...Array(80)].map((_, i) => (
              <Star
                key={i}
                delay={Math.random() * 5}
                top={`${Math.random() * 70}%`}
                left={`${Math.random() * 100}%`}
                size={Math.random() * 2 + 1}
              />
            ))}
            {[...Array(3)].map((_, i) => (
              <ShootingStar key={`shooting-${i}`} delay={i * 15 + Math.random() * 5} />
            ))}
          </div>
        )
      };
    }
    
    if (lowerCondition.includes('cloudy')) {
      return {
        background: 'linear-gradient(180deg, #1a1d2e 0%, #2d3142 50%, #3f4359 100%)',
        effects: (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Moon />
            <CloudIcon className="top-5 left-5 opacity-30 text-gray-400" />
            <CloudIcon className="top-16 right-10 opacity-25 text-gray-400" style={{ animationDelay: '3s' }} />
            <CloudIcon className="top-28 left-1/4 opacity-30 text-gray-400" style={{ animationDelay: '6s' }} />
            {[...Array(30)].map((_, i) => (
              <Star
                key={i}
                delay={Math.random() * 5}
                top={`${Math.random() * 50}%`}
                left={`${Math.random() * 100}%`}
                size={Math.random() * 1.5 + 0.5}
              />
            ))}
          </div>
        )
      };
    }
    
    if (lowerCondition.includes('rain')) {
      return {
        background: 'linear-gradient(180deg, #1a1d2e 0%, #252a3d 50%, #2f3548 100%)',
        effects: (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <CloudIcon className="top-5 left-10 opacity-40 text-gray-500" />
            <CloudIcon className="top-12 right-16 opacity-35 text-gray-500" style={{ animationDelay: '2s' }} />
            {[...Array(25)].map((_, i) => (
              <RainDrop
                key={i}
                delay={Math.random() * 2}
                left={`${Math.random() * 100}%`}
              />
            ))}
          </div>
        )
      };
    }
  }
  
  // Dawn (5 AM - 7 AM)
  if (timeOfDay === 'dawn') {
    return {
      background: 'linear-gradient(180deg, #2d3561 0%, #4a5f8f 25%, #ff9a76 50%, #ffc3a0 75%, #ffe5d4 100%)',
      effects: (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 right-16 w-28 h-28">
            <div className="absolute inset-0 bg-orange-300 rounded-full blur-3xl opacity-40" />
            <div className="absolute inset-2 bg-orange-400 rounded-full blur-2xl opacity-50" />
            <div className="absolute inset-4 bg-orange-200 rounded-full" />
          </div>
          {lowerCondition.includes('cloudy') && (
            <>
              <CloudIcon className="top-10 left-10 opacity-25 text-orange-300" />
              <CloudIcon className="top-20 right-20 opacity-20 text-pink-300" style={{ animationDelay: '5s' }} />
            </>
          )}
        </div>
      )
    };
  }
  
  // Evening/Dusk (5 PM - 9 PM)
  if (timeOfDay === 'evening' || timeOfDay === 'dusk') {
    return {
      background: 'linear-gradient(180deg, #1e3a8a 0%, #fb923c 30%, #f97316 50%, #fbbf24 70%, #fde68a 100%)',
      effects: (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 right-24 w-32 h-32">
            <div className="absolute inset-0 bg-orange-400 rounded-full blur-3xl opacity-50" />
            <div className="absolute inset-2 bg-orange-500 rounded-full blur-2xl opacity-60" />
            <div className="absolute inset-6 bg-orange-300 rounded-full" />
          </div>
          {lowerCondition.includes('cloudy') && (
            <>
              <CloudIcon className="top-10 left-10 opacity-30 text-orange-400" />
              <CloudIcon className="top-20 right-1/4 opacity-25 text-pink-400" style={{ animationDelay: '5s' }} />
              <CloudIcon className="top-32 left-1/3 opacity-30 text-red-400" style={{ animationDelay: '10s' }} />
            </>
          )}
          {timeOfDay === 'dusk' && [...Array(20)].map((_, i) => (
            <Star
              key={i}
              delay={Math.random() * 5}
              top={`${Math.random() * 30}%`}
              left={`${Math.random() * 100}%`}
              size={Math.random() * 1.5 + 0.5}
            />
          ))}
        </div>
      )
    };
  }
  
  // Daytime backgrounds (Morning/Afternoon)
  if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
    return {
      background: 'linear-gradient(180deg, #87CEEB 0%, #B0E3FF 40%, #E0F6FF 70%, #FFE4B5 100%)',
      effects: (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Sun />
        </div>
      )
    };
  }
  
  if (lowerCondition.includes('partly cloudy')) {
    return {
      background: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 50%, #F0F8FF 100%)',
      effects: (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Sun />
          <CloudIcon className="top-24 left-10 text-white" />
          <CloudIcon className="top-32 right-20 text-white" style={{ animationDelay: '5s' }} />
          <CloudIcon className="top-44 left-1/3 text-white" style={{ animationDelay: '10s' }} />
        </div>
      )
    };
  }
  
  if (lowerCondition.includes('cloudy')) {
    return {
      background: 'linear-gradient(180deg, #696969 0%, #A9A9A9 50%, #D3D3D3 100%)',
      effects: (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <CloudIcon className="top-5 left-5 text-gray-300" />
          <CloudIcon className="top-16 right-10 text-gray-300" style={{ animationDelay: '3s' }} />
          <CloudIcon className="top-28 left-1/4 text-gray-300" style={{ animationDelay: '6s' }} />
          <CloudIcon className="top-40 right-1/3 text-gray-300" style={{ animationDelay: '9s' }} />
        </div>
      )
    };
  }
  
  if (lowerCondition.includes('rain') || lowerCondition.includes('rainy')) {
    return {
      background: 'linear-gradient(180deg, #2F4F4F 0%, #708090 50%, #B0C4DE 100%)',
      effects: (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <CloudIcon className="top-5 left-10 text-gray-400" />
          <CloudIcon className="top-12 right-16 text-gray-400" style={{ animationDelay: '2s' }} />
          <CloudIcon className="top-24 left-1/4 text-gray-400" style={{ animationDelay: '4s' }} />
          {[...Array(30)].map((_, i) => (
            <RainDrop
              key={i}
              delay={Math.random() * 2}
              left={`${Math.random() * 100}%`}
            />
          ))}
        </div>
      )
    };
  }
  
  if (lowerCondition.includes('snow')) {
    return {
      background: 'linear-gradient(180deg, #E6E6FA 0%, #F8F8FF 50%, #FFFAFA 100%)',
      effects: (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <CloudIcon className="top-8 left-12 text-gray-300" />
          <CloudIcon className="top-20 right-20 text-gray-300" style={{ animationDelay: '3s' }} />
          {[...Array(20)].map((_, i) => (
            <SnowFlake
              key={i}
              delay={Math.random() * 5}
              left={`${Math.random() * 100}%`}
            />
          ))}
        </div>
      )
    };
  }
  
  // Default daytime background
  return {
    background: 'linear-gradient(180deg, #87CEEB 0%, #E0F6FF 50%, #F0F8FF 100%)',
    effects: (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sun />
      </div>
    )
  };
};

export function WeatherBackground({ condition, children }: WeatherBackgroundProps) {
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  
  useEffect(() => {
    // Update time of day every minute
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const { background, effects } = getWeatherBackground(condition, timeOfDay);
  
  return (
    <div 
      className="min-h-screen relative transition-all duration-1000"
      style={{ background }}
    >
      {effects}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
