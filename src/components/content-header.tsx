import { LocationSearchDialog } from "./location-search-dialog";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Search, ChevronDown, Star, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface SavedLocation {
  id: string;
  name: string;
  country: string;
  isFavorite: boolean;
  temperature: number;
  condition: string;
  lastUpdated: string;
  coordinates: { lat: number; lng: number };
}

interface ContentHeaderProps {
  currentLocation: string;
  onLocationChange: (location: { name: string, lat: number, lng: number }) => void;
}

export function ContentHeader({
  currentLocation,
  onLocationChange
}: ContentHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [currentLocationIsFavorite, setCurrentLocationIsFavorite] = useState(false);

  // Load saved locations from localStorage
  useEffect(() => {
    const loadLocations = () => {
      const saved = localStorage.getItem("skysense_saved_locations");
      if (saved) {
        try {
          const parsedLocations = JSON.parse(saved);
          setSavedLocations(parsedLocations);
          
          // Check if current location is favorite
          const currentLoc = parsedLocations.find(
            (loc: SavedLocation) => `${loc.name}, ${loc.country}` === currentLocation
          );
          setCurrentLocationIsFavorite(currentLoc?.isFavorite || false);
        } catch (e) {
          console.error("Error loading saved locations:", e);
        }
      }
    };

    loadLocations();

    // Listen for storage changes to update the dropdown when locations are modified
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "skysense_saved_locations") {
        loadLocations();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom event for same-tab updates
    const handleCustomUpdate = () => loadLocations();
    window.addEventListener("locations-updated", handleCustomUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("locations-updated", handleCustomUpdate);
    };
  }, [currentLocation]);

  const favoriteLocations = savedLocations.filter(loc => loc.isFavorite);
  const otherLocations = savedLocations.filter(loc => !loc.isFavorite);

  const handleLocationSelect = (location: SavedLocation) => {
    onLocationChange({
      name: `${location.name}, ${location.country}`,
      lat: location.coordinates.lat,
      lng: location.coordinates.lng
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from triggering
    
    const saved = localStorage.getItem("skysense_saved_locations");
    // This function will be fully implemented when saved locations are moved to the database
  };

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full mb-6"
      >
        <div className="flex items-center justify-between gap-4 w-full">
          {/* Current Location Display with Dropdown - Left Side */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 px-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl border border-white/20 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all hover:shadow-md group relative">
                          <span className="text-sky-600 dark:text-sky-400">📍</span>
                          <span className="whitespace-nowrap">{currentLocation}</span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors" />
                          {favoriteLocations.length > 0 && (
                            <Badge 
                              variant="secondary" 
                              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"
                            >
                              {favoriteLocations.length}
                            </Badge>
                          )}
                        </button>
                      </DropdownMenuTrigger>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">
                      {savedLocations.length > 0 
                        ? `View ${savedLocations.length} saved location${savedLocations.length > 1 ? 's' : ''}`
                        : 'Click to see saved locations'
                      }
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent 
                align="start" 
                className="w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/50"
              >
                <DropdownMenuLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-sky-500" />
                  Saved Locations
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <ScrollArea className="max-h-96">
                  {/* Favorite Locations */}
                  {favoriteLocations.length > 0 && (
                    <>
                      <div className="px-2 py-1.5">
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          Favorites
                        </p>
                      </div>
                      {favoriteLocations.map((location) => (
                        <DropdownMenuItem
                          key={location.id}
                          className="cursor-pointer flex items-center justify-between py-3 px-3 mx-1 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{location.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {location.country}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sky-600 dark:text-sky-400">
                                {location.temperature}°
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {location.condition}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      {otherLocations.length > 0 && (
                        <DropdownMenuSeparator className="my-2" />
                      )}
                    </>
                  )}

                  {/* Other Locations */}
                  {otherLocations.length > 0 && (
                    <>
                      {favoriteLocations.length > 0 && (
                        <div className="px-2 py-1.5">
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            All Locations
                          </p>
                        </div>
                      )}
                      {otherLocations.map((location) => (
                        <DropdownMenuItem
                          key={location.id}
                          className="cursor-pointer flex items-center justify-between py-3 px-3 mx-1 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{location.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {location.country}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sky-600 dark:text-sky-400">
                                {location.temperature}°
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {location.condition}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}

                  {/* Empty State */}
                  {savedLocations.length === 0 && (
                    <div className="px-4 py-6 text-center">
                      <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-muted-foreground mb-1">No saved locations</p>
                      <p className="text-xs text-muted-foreground">
                        Add locations from the Saved Locations page
                      </p>
                    </div>
                  )}
                </ScrollArea>

                {savedLocations.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-xs text-muted-foreground hover:text-sky-600 dark:hover:text-sky-400"
                        onClick={() => setIsSearchOpen(true)}
                      >
                        <Search className="h-3 w-3 mr-2" />
                        Search for more locations
                      </Button>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Favorite Star Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-white/20 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 shadow-lg"
                    onClick={handleToggleFavorite}
                  >
                    <Star 
                      className={`h-5 w-5 ${
                        currentLocationIsFavorite 
                          ? "text-amber-500 fill-amber-500" 
                          : "text-muted-foreground"
                      } transition-all`} 
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">
                    {currentLocationIsFavorite ? "Remove from favorites" : "Add to favorites"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Search Button - Far Right */}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-white/20 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 shadow-lg"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      {/* Search Dialog */}
      <LocationSearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currentLocation={currentLocation}
        onLocationChange={onLocationChange}
      />
    </>
  );
}