import { Badge } from "./ui/badge";
import { 
  Home, 
  Lightbulb, 
  Bell, 
  Users,
  User
} from "lucide-react";

interface BottomNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  alertCount: number;
  reportCount: number;
}

const navItems = [
  {
    id: 'home',
    label: 'Weather',
    icon: Home,
    color: 'text-sky-500 dark:text-sky-400'
  },
  {
    id: 'advisors',
    label: 'Advisors',
    icon: Lightbulb,
    color: 'text-amber-500 dark:text-amber-400'
  },
  {
    id: 'notifications',
    label: 'Alerts',
    icon: Bell,
    color: 'text-red-500 dark:text-red-400'
  },
  {
    id: 'community',
    label: 'Community',
    icon: Users,
    color: 'text-green-500 dark:text-green-400'
  },
  {
    id: 'settings',
    label: 'Profile',
    icon: User,
    color: 'text-gray-600 dark:text-gray-400'
  }
];

export function BottomNavigation({ 
  activeSection, 
  onSectionChange, 
  alertCount,
  reportCount 
}: BottomNavigationProps) {
  const getBadgeCount = (itemId: string) => {
    switch (itemId) {
      case 'notifications':
        return alertCount;
      case 'community':
        return reportCount;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-white/95 via-white/90 to-white/85 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-900/85 backdrop-blur-xl border-t border-white/40 dark:border-slate-800/40 safe-area-pb shadow-2xl">
      <div className="flex items-center justify-between py-2 px-1 sm:px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const badgeCount = getBadgeCount(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`relative flex flex-col items-center py-2 px-1 sm:px-2 rounded-2xl transition-all duration-300 flex-1 transform hover:scale-105 ${
                isActive 
                  ? 'bg-gradient-to-t from-sky-50 to-white/80 dark:from-sky-950 dark:to-slate-800/80 shadow-lg shadow-sky-500/20 scale-105' 
                  : 'hover:bg-white/60 dark:hover:bg-slate-800/60 hover:shadow-md'
              }`}
            >
              <div className="relative">
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/80 shadow-sm' 
                    : 'group-hover:bg-white/60'
                }`}>
                  <Icon 
                    className={`h-5 w-5 sm:h-6 sm:w-6 transition-all duration-200 ${
                      isActive ? item.color : 'text-gray-600'
                    }`} 
                  />
                </div>
                {badgeCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-xs animate-pulse-slow bg-gradient-to-r from-red-500 to-red-600 shadow-lg"
                  >
                    {badgeCount}
                  </Badge>
                )}
              </div>
              <span 
                className={`text-[10px] sm:text-xs mt-1 font-semibold leading-tight text-center transition-colors duration-200 ${
                  isActive ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}