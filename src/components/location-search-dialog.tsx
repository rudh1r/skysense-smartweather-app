import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  MapPin,
  Search,
  X,
  Loader2,
  Navigation,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

interface LocationSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onLocationChange: (location: { name: string, lat: number, lng: number }) => void;
}

interface LocationResult {
  name: string;
  lat: number;
  lng: number;
  country: string;
  id: number;
  temp?: string;
  trending?: boolean;
}

const mockRecentSearches: LocationResult[] = [
  { id: 1, name: "San Francisco, CA", country: "United States" },
  { id: 2, name: "New York, NY", country: "United States" },
  { id: 3, name: "London", country: "United Kingdom" },
];

const mockPopularLocations: LocationResult[] = [
  { id: 1, name: "Tokyo", country: "Japan", trending: true },
  { id: 2, name: "Paris", country: "France" },
  { id: 3, name: "Dubai", country: "UAE", trending: true },
  { id: 4, name: "Sydney", country: "Australia" },
];

export function LocationSearchDialog({
  isOpen,
  onClose,
  currentLocation,
  onLocationChange,
}: LocationSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [savedLocations, setSavedLocations] = useState<Set<string>>(new Set());

  // Load saved locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("skysense_saved_locations");
    if (saved) {
      try {
        const locations = JSON.parse(saved);
        setSavedLocations(new Set(locations.map((loc: any) => loc.name)));
      } catch (e) {
        console.error("Error loading saved locations:", e);
      }
    }
  }, [isOpen]);

  // Mock search results
  const mockSearchResults: LocationResult[] = [
    { id: 1, name: "Los Angeles, CA", country: "United States", temp: "22°C", lat: 34.0522, lng: -118.2437 },
    { id: 2, name: "Las Vegas, NV", country: "United States", temp: "28°C", lat: 36.1699, lng: -115.1398 },
    { id: 3, name: "London", country: "United Kingdom", temp: "15°C", lat: 51.5072, lng: -0.1276 },
    { id: 4, name: "Berlin", country: "Germany", temp: "18°C", lat: 52.5200, lng: 13.4050 },
    { id: 5, name: "Barcelona", country: "Spain", temp: "24°C", lat: 41.3851, lng: 2.1734 },
  ];

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const filtered = mockSearchResults.filter(
          (loc) =>
            loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc.country.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleLocationSelect = (locationName: string) => {
    onLocationChange({ name: locationName, lat: 0, lng: 0 }); // Coords are mock here
    setSearchQuery("");
    onClose();
  };

  const handleSaveLocation = (location: LocationResult, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const saved = localStorage.getItem("skysense_saved_locations");
    let locations = [];
    
    try {
      locations = saved ? JSON.parse(saved) : [];
    } catch (e) {
      locations = [];
    }

    const isAlreadySaved = locations.some((loc: any) => loc.name === location.name);

    if (isAlreadySaved) {
      // Remove from saved
      locations = locations.filter((loc: any) => loc.name !== location.name);
      setSavedLocations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(location.name);
        return newSet;
      });
    } else {
      // Add to saved
      const newLocation = {
        id: Date.now().toString(),
        name: location.name,
        country: location.country,
        isFavorite: false,
        temperature: parseInt(location.temp || "20"),
        condition: "Partly Cloudy",
        lastUpdated: "Just now",
        coordinates: { lat: 0, lng: 0 },
      };
      locations.push(newLocation);
      setSavedLocations((prev) => new Set([...prev, location.name]));
    }

    localStorage.setItem("skysense_saved_locations", JSON.stringify(locations));
  };

  const handleUseCurrentLocation = async () => {
    setIsGettingLocation(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setIsGettingLocation(false);
      return;
    }

    const success = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const geoApiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

      try {
        const response = await fetch(geoApiUrl);
        const data = await response.json();
        if (data && data.length > 0) {
          const location = data[0];
          const locationName = `${location.name}, ${location.state ? `${location.state}, ` : ''}${location.country}`;
          onLocationChange({ name: locationName, lat: latitude, lng: longitude });
          onClose();
        } else {
          alert("Could not determine location name from coordinates.");
        }
      } catch (error) {
        console.error("Error fetching location name:", error);
        alert("Error fetching location name.");
      } finally {
        setIsGettingLocation(false);
      }
    };

    const error = () => {
      alert("Unable to retrieve your location. Please ensure location services are enabled.");
      setIsGettingLocation(false);
    };

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
    });
  };

  const isSaved = (locationName: string) => savedLocations.has(locationName);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Search Locations
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
            {isGettingLocation ? (
              <>
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                <span>Getting Current Location...</span>
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4 text-primary" />
                <span>Use Current Location</span>
              </>
            )}
          </Button>

          <ScrollArea className="h-[400px] pr-4">
            {/* Search Results */}
            {isSearching && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {searchResults.length > 0 && !isSearching && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground px-2 mb-3">Search Results</p>
                {searchResults.map((location) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <button
                      onClick={() => handleLocationSelect(location.name)}
                      className="flex-1 flex items-center gap-3 text-left"
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">{location.name}</p>
                        <p className="text-sm text-muted-foreground">{location.country}</p>
                      </div>
                      {location.temp && (
                        <span className="text-sm font-medium text-primary">{location.temp}</span>
                      )}
                    </button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleSaveLocation(location, e)}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          isSaved(location.name)
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {searchQuery.length === 0 && (
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
                  <Clock className="h-4 w-4" />
                  <span>Recent Searches</span>
                </div>
                <div className="space-y-1">
                  {mockRecentSearches.map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <button
                        onClick={() => handleLocationSelect(location.name)}
                        className="flex-1 flex items-center gap-3 text-left"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{location.name}</p>
                          <p className="text-sm text-muted-foreground">{location.country}</p>
                        </div>
                      </button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleSaveLocation(location, e)}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            isSaved(location.name)
                              ? "fill-amber-500 text-amber-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Locations */}
            {searchQuery.length === 0 && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
                  <Star className="h-4 w-4" />
                  <span>Popular Locations</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {mockPopularLocations.map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <button
                        onClick={() => handleLocationSelect(location.name)}
                        className="flex-1 flex items-center gap-2 text-left"
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
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleSaveLocation(location, e)}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            isSaved(location.name)
                              ? "fill-amber-500 text-amber-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}