import { LocationSearch } from "./location-search";
import { UserProfileDropdown } from "./user-profile-dropdown";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Cloud, Bell, Menu, X, Search, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface AppHeaderProps {
  currentLocation: string;
  onLocationChange: (location: string) => void;
  onSettingsClick?: () => void;
  alertCount?: number;
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function AppHeader({
  currentLocation,
  onLocationChange,
  onSettingsClick,
  alertCount = 0,
  onMenuToggle,
  isMobileMenuOpen = false
}: AppHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Left Section: Logo & Location */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg bg-[rgba(0,0,0,0)]">
                <Cloud className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Current Location Name */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <MapPin className="h-5 w-5 text-sky-500 dark:text-sky-400 flex-shrink-0" />
              <span className="truncate text-muted-foreground">{currentLocation}</span>
            </div>
          </div>

          {/* Right Section: Actions & Profile */}
          <div className="flex items-center gap-2">
            {/* Search Icon/Bar */}
            <AnimatePresence mode="wait">
              {!isSearchExpanded ? (
                <motion.div
                  key="search-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsSearchExpanded(true)}
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="search-bar"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hidden md:block"
                >
                  <div className="relative w-80">
                    <LocationSearch
                      currentLocation={currentLocation}
                      onLocationChange={onLocationChange}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8"
                      onClick={() => setIsSearchExpanded(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <Bell className="h-5 w-5" />
              {alertCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {alertCount}
                </Badge>
              )}
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile */}
            <UserProfileDropdown onSettingsClick={onSettingsClick} />
          </div>
        </div>

        {/* Location Search - Mobile (Toggle) */}
        <AnimatePresence>
          {isSearchExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden pb-3 overflow-hidden"
            >
              <div className="relative">
                <LocationSearch
                  currentLocation={currentLocation}
                  onLocationChange={onLocationChange}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 z-10"
                  onClick={() => setIsSearchExpanded(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
