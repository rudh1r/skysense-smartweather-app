import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { 
  MapPin, 
  Search, 
  X, 
  Loader2, 
  Navigation,
  Clock,
  Star,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LocationSearchProps {
  currentLocation: string;
  onLocationChange: (location: string) => void;
  className?: string;
}

const mockRecentSearches = [
  { id: 1, name: "San Francisco, CA", country: "United States" },
  { id: 2, name: "New York, NY", country: "United States" },
  { id: 3, name: "London", country: "United Kingdom" },
];

const mockPopularLocations = [
  { id: 1, name: "Tokyo", country: "Japan", trending: true },
  { id: 2, name: "Paris", country: "France" },
  { id: 3, name: "Dubai", country: "UAE", trending: true },
  { id: 4, name: "Sydney", country: "Australia" },
];

export function LocationSearch({ 
  currentLocation, 
  onLocationChange,
  className = "" 
}: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock search results
  const mockSearchResults = [
    { id: 1, name: "Los Angeles, CA", country: "United States", temp: "22°C" },
    { id: 2, name: "Las Vegas, NV", country: "United States", temp: "28°C" },
    { id: 3, name: "London", country: "United Kingdom", temp: "15°C" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setSearchResults(mockSearchResults);
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleLocationSelect = (locationName: string) => {
    onLocationChange(locationName);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleUseCurrentLocation = () => {
    // Simulate getting current location
    handleLocationSelect("San Francisco, CA");
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full md:w-auto justify-start gap-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-white/20 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 shadow-lg px-6 py-4 h-auto"
      >
        <MapPin className="h-6 w-6 text-primary" />
        <span className="flex-1 text-left truncate">{currentLocation}</span>
        <Search className="h-5 w-5 text-muted-foreground" />
      </Button>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="p-4 space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for a city or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 bg-muted/50"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Current Location Button */}
                <Button
                  variant="outline"
                  onClick={handleUseCurrentLocation}
                  className="w-full justify-start gap-3 bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-950"
                >
                  <Navigation className="h-4 w-4 text-primary" />
                  <span>Use Current Location</span>
                </Button>

                {/* Search Results */}
                {isSearching && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}

                {searchResults.length > 0 && !isSearching && (
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    <p className="text-sm text-muted-foreground px-2 mb-2">Search Results</p>
                    {searchResults.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleLocationSelect(location.name)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{location.name}</p>
                            <p className="text-sm text-muted-foreground">{location.country}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-primary">{location.temp}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Recent Searches */}
                {searchQuery.length === 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
                      <Clock className="h-4 w-4" />
                      <span>Recent Searches</span>
                    </div>
                    <div className="space-y-1">
                      {mockRecentSearches.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => handleLocationSelect(location.name)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                        >
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{location.name}</p>
                            <p className="text-sm text-muted-foreground">{location.country}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Locations */}
                {searchQuery.length === 0 && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
                      <Star className="h-4 w-4" />
                      <span>Popular Locations</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {mockPopularLocations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => handleLocationSelect(location.name)}
                          className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <p className="font-medium text-sm">{location.name}</p>
                              {location.trending && (
                                <TrendingUp className="h-3 w-3 text-orange-500" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{location.country}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
