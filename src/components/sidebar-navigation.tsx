import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { useAuth } from "./auth-context";
import { 
  Home, 
  Lightbulb, 
  Users,
  Cloud,
  ChevronLeft,
  ChevronRight,
  User,
  Bell
} from "lucide-react";

interface SidebarNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  alertCount: number;
  reportCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSignInClick: () => void;
  user: any; // The authenticated user object from useAuth
}

const navItems = [
  {
    id: 'home',
    label: 'Weather',
    icon: Home,
    color: 'text-blue-500',
    description: 'Current conditions & forecasts'
  },
  {
    id: 'advisors',
    label: 'Advisors',
    icon: Lightbulb,
    color: 'text-amber-500',
    description: 'Health & lifestyle recommendations'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    color: 'text-red-500',
    description: 'Weather alerts & notifications'
  },
  {
    id: 'community',
    label: 'Community',
    icon: Users,
    color: 'text-green-500',
    description: 'Local weather reports'
  },
  {
    id: 'settings',
    label: 'My Profile',
    icon: User,
    color: 'text-gray-600',
    description: 'Account & personal settings'
  }
];

export function SidebarNavigation({ 
  activeSection, 
  onSectionChange, 
  alertCount,
  reportCount,
  isCollapsed,
  onToggleCollapse,
  onSignInClick,
  user
}: SidebarNavigationProps) {
  const isAuthenticated = !!user;
  
  const handleMenuItemClick = (section: string) => {
    onSectionChange(section);
  };
  
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

  const initials = user?.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'G';

  return (
    <div className={`fixed left-0 top-0 bottom-0 bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-900/95 backdrop-blur-xl border-r border-white/30 dark:border-slate-800/50 z-40 flex flex-col shadow-2xl transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-20' : 'w-[20rem]'
    }`}>
      {/* Header */}
      <div className={`border-b border-white/30 dark:border-slate-800/50 transition-all ${isCollapsed ? 'p-4' : 'p-6'}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} cursor-default`}>
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                  <Cloud className="h-6 w-6 text-white drop-shadow-sm" />
                </div>
                {!isCollapsed && (
                  <div>
                    <h1 className="font-bold text-xl bg-gradient-to-r from-sky-600 to-teal-600 dark:from-sky-400 dark:to-teal-400 bg-clip-text text-transparent">SkySense</h1>
                    <p className="text-muted-foreground text-sm">Weather Intelligence</p>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p className="font-medium">SkySense</p>
                <p className="text-xs text-muted-foreground">Weather Intelligence</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Navigation Items */}
      <div className={`flex-1 overflow-y-auto space-y-2 ${isCollapsed ? 'p-3' : 'p-6'} scrollbar-thin scrollbar-thumb-sky-300/50 scrollbar-track-transparent hover:scrollbar-thumb-sky-400/70 dark:scrollbar-thumb-slate-700/50 dark:hover:scrollbar-thumb-slate-600/70`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const badgeCount = getBadgeCount(item.id);
          
          const button = (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center rounded-2xl transition-all duration-300 group ${
                isCollapsed ? 'p-3 justify-center' : 'p-4 transform hover:scale-[1.02]'
              } ${
                isActive 
                  ? 'bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/50 dark:to-cyan-950/50 border border-sky-200/50 dark:border-sky-800/50 shadow-lg shadow-sky-500/10' 
                  : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-sky-50/30 dark:hover:from-slate-800/50 dark:hover:to-sky-950/30 hover:shadow-md border border-transparent'
              }`}
            >
              <div className="relative">
                <div className={`p-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/80 shadow-sm' 
                    : 'group-hover:bg-white/60'
                }`}>
                  <Icon 
                    className={`h-6 w-6 transition-all duration-200 ${
                      isActive ? item.color : 'text-gray-600 group-hover:text-gray-900'
                    }`} 
                  />
                </div>
                {badgeCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse-slow shadow-lg bg-gradient-to-r from-red-500 to-red-600"
                  >
                    {badgeCount}
                  </Badge>
                )}
              </div>
              
              {!isCollapsed && (
                <div className="ml-4 flex-1 text-left">
                  <div className={`font-semibold transition-colors duration-200 ${
                    isActive ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {item.label}
                  </div>
                  <div className={`text-xs mt-1 transition-colors duration-200 ${
                    isActive ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    {item.description}
                  </div>
                </div>
              )}
            </button>
          );

          // Wrap in tooltip when collapsed
          if (isCollapsed) {
            return (
              <TooltipProvider key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {button}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-2">
                    <span>{item.label}</span>
                    {badgeCount > 0 && (
                      <Badge variant="destructive" className="h-5 px-1.5">
                        {badgeCount}
                      </Badge>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return button;
        })}
      </div>

      {/* Footer with User Profile and Toggle */}
      <div className="border-t border-white/30 dark:border-slate-800/50 space-y-3 p-4">
        {/* Collapse/Expand Toggle - Top of Footer */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={onToggleCollapse}
                  variant="outline"
                  size={isCollapsed ? "icon" : "default"}
                  className="w-full bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border-white/40 dark:border-slate-700/50 transition-all hover:shadow-md"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-5 w-5" />
                  ) : (
                    <>
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      Collapse Sidebar
                    </>
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isCollapsed ? "Expand" : "Collapse"} sidebar (Ctrl/⌘ + B)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator className="bg-white/20 dark:bg-slate-700/50" />

        {/* User Profile Section - Authenticated */}
        {isAuthenticated && user && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => handleMenuItemClick('settings')}
                    className={`w-full flex items-center gap-3 rounded-xl p-3 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all hover:shadow-sm ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <Avatar className="h-10 w-10 border-2 border-primary/20 flex-shrink-0">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-sky-500 to-teal-500 text-white text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">Click to view profile</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </>
        )}

        {/* Guest Profile Section - Not Authenticated */}
        {!isAuthenticated && (
          <>
            <div className={`w-full rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-200/50 dark:border-sky-800/50 transition-all ${isCollapsed ? 'p-3' : 'p-4'}`}>
              {isCollapsed ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={onSignInClick}
                        className="flex justify-center w-full hover:opacity-80 transition-opacity"
                      >
                        <Avatar className="h-10 w-10 border-2 border-sky-300/50 dark:border-sky-700/50 cursor-pointer hover:border-sky-400/70 dark:hover:border-sky-600/70 transition-all">
                          <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-500 text-white text-sm">
                            G
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex flex-col gap-2 p-3">
                      <p className="font-medium">Guest User</p>
                      <p className="text-xs text-muted-foreground">Click to sign in</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-sky-300/50 dark:border-sky-700/50">
                        <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-500 text-white text-sm">
                          G
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-amber-500 rounded-full border-2 border-sky-50 dark:border-sky-950 animate-pulse" title="Guest Mode" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">Guest User</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Browsing Mode</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={onSignInClick}
                    size="sm"
                    className="w-full bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] animate-glow"
                  >
                    Sign In / Sign Up
                  </Button>
                  
                  <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2">
                    Unlock premium features
                  </p>
                </>
              )}
            </div>
          </>
        )}

        {/* Status Footer - Only when expanded */}
        {!isCollapsed && (
          <>
            <Separator className="bg-white/20 dark:bg-slate-700/50" />
            <div className="text-muted-foreground text-xs text-center bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-lg py-2 px-3">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}