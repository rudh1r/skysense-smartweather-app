import { Button } from "./ui/button";
import { 
  Cloud, 
  Zap,
  MapPin,
  Bell,
  Shield,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onContinueAsGuest?: () => void;
}

export function WelcomeScreen({ onGetStarted, onContinueAsGuest }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-sky-400 via-cyan-400 to-teal-400 dark:from-sky-950 dark:via-cyan-950 dark:to-teal-950 overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 h-full flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* Logo */}
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1
              }}
            >
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center border-2 border-white/30 shadow-2xl">
                  <Cloud className="h-10 w-10 text-white" />
                  <Sparkles className="h-5 w-5 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
            </motion.div>

            {/* Brand Name & Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <h1 className="text-6xl md:text-7xl text-white tracking-tight">
                SkySense
              </h1>
              <p className="text-lg text-white/90 max-w-xl mx-auto">
                Intelligent weather companion powered by AI
              </p>
            </motion.div>

            {/* Feature Pills - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto"
            >
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-sm">
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  Real-time
                </span>
              </div>
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Hyper-local
                </span>
              </div>
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-sm">
                <span className="flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5" />
                  Smart Alerts
                </span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-4 space-y-3"
            >
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-white hover:bg-white/90 text-sky-600 px-10 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group"
              >
                <span className="mr-2">Get Started</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              {onContinueAsGuest && (
                <div>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={onContinueAsGuest}
                    className="text-white hover:bg-white/10 px-8 py-6 rounded-2xl transition-all duration-300"
                  >
                    Continue as Guest
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Privacy Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 text-white/80 text-sm pt-2"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Privacy-first • Location data never shared</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}