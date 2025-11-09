import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { useAuth } from "./auth-context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { 
  MapPin, 
  Star, 
  Trash2, 
  Plus,
  Cloud,
  Search,
  X,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0';

interface SavedLocation {
  id: string;
  name: string;
  country: string;
  isFavorite: boolean;
  temperature?: number;
  condition?: string;
  lastUpdated?: string;
  coordinates: { lat: number; lng: number };
}

interface SavedLocationsSectionProps {
  onLocationSelect?: (location: string, coords: { lat: number, lng: number }) => void;
}

export function SavedLocationsSection({ onLocationSelect }: SavedLocationsSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newLocationName, setNewLocationName] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isUpdatingWeather, setIsUpdatingWeather] = useState(false);

  const searchLocations = async (query: string) => {
    const response = await fetch(`${OPENWEATHER_GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`);
    if (!response.ok) throw new Error('Failed to search locations');
    const data = await response.json();
    return data.map((location: any) => ({
      name: `${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`,
      city: location.name,
      state: location.state,
      country: location.country,
      latitude: location.lat,
      longitude: location.lon,
    }));
  };

  // Fetch location suggestions from OpenWeatherMap Geocoding API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (newLocationName.length < 2) {
        setLocationSuggestions([]);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const suggestions = await searchLocations(newLocationName);
        setLocationSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [newLocationName, isAuthenticated]);

  // Load locations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("skysense_saved_locations");
    if (saved) {
      setLocations(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  const handleToggleFavorite = (id: string) => {
    const updatedLocations = locations.map(loc =>
      loc.id === id ? { ...loc, isFavorite: !loc.isFavorite } : loc
    );
    setLocations(updatedLocations);
    localStorage.setItem("skysense_saved_locations", JSON.stringify(updatedLocations));
    toast.success("Favorite status updated");
  };

  const handleDeleteLocation = (id: string, name: string) => {
    const updatedLocations = locations.filter(loc => loc.id !== id);
    setLocations(updatedLocations);
    localStorage.setItem("skysense_saved_locations", JSON.stringify(updatedLocations));
    toast.success(`${name} removed from saved locations`);
  };

  // Fetch weather data for a location
  const fetchWeatherData = async (lat: number, lon: number) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    const weather = await getCurrentWeather(lat, lon);
    return {
      temp: weather.temperature,
      condition: weather.condition,
    };
  };

  const handleAddLocation = async (suggestion?: any) => {
    if (!suggestion && !newLocationName.trim()) {
      toast.error("Please enter a location name");
      return;
    }

    const locationData = suggestion || {
      name: newLocationName,
      country: "Unknown",
      latitude: 0,
      longitude: 0
    };

    const weather = await fetchWeatherData(locationData.latitude, locationData.longitude);

    const newLocation: SavedLocation = {
      id: Date.now().toString(),
      name: locationData.name,
      country: locationData.country_code || locationData.country,
      isFavorite: false,
      temperature: weather.temp,
      condition: weather.condition,
      lastUpdated: "Just now",
      coordinates: { lat: locationData.latitude, lng: locationData.longitude }
    };

    const updatedLocations = [...locations, newLocation];
    setLocations(updatedLocations);
    localStorage.setItem("skysense_saved_locations", JSON.stringify(updatedLocations));

    toast.success(`${locationData.name} added to saved locations`);
    setNewLocationName("");
    setShowSuggestions(false);
    setLocationSuggestions([]);
    setIsAdding(false);
  };

  // Refresh weather data for all locations
  const handleRefreshWeather = async () => {
    setIsUpdatingWeather(true);
    toast.info("Updating weather data...");
    
    const updatedLocations = await Promise.all(
      locations.map(async (loc) => {
        const weather = await fetchWeatherData(loc.coordinates.lat, loc.coordinates.lng); // This should be loc.latitude, loc.longitude
        return {
          ...loc,
          temperature: weather.temp,
          condition: weather.condition,
          lastUpdated: "Just now",
        };
      })
    );
    
    setLocations(updatedLocations);
    localStorage.setItem("skysense_saved_locations", JSON.stringify(updatedLocations));
    setIsUpdatingWeather(false);
    toast.success("Weather data updated!");
  };

  const handleSelectLocation = (location: SavedLocation) => {
    if (onLocationSelect) {
      onLocationSelect(`${location.name}, ${location.country}`, location.coordinates);
    }
    toast.success(`Viewing weather for ${location.name}`);
  };

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteLocations = filteredLocations.filter(loc => loc.isFavorite);
  const otherLocations = filteredLocations.filter(loc => !loc.isFavorite);

  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading saved locations...</p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <Card className="p-6 bg-gradient-to-br from-white/90 to-sky-50/80 dark:from-slate-900/90 dark:to-sky-950/50 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Saved Locations</h2>
            <p className="text-muted-foreground">
              Manage your favorite weather locations ({locations.length} saved)
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRefreshWeather}
              variant="outline"
              disabled={isUpdatingWeather || locations.length === 0}
            >
              {isUpdatingWeather ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Cloud className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
            <Button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600"
            >
              {isAdding ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Add Location Card */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
              <h3 className="font-semibold mb-4">Add New Location</h3>
              <div className="relative">
                <div className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Type to search for cities..."
                      value={newLocationName}
                      onChange={(e) => setNewLocationName(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="flex-1"
                    />
                    {isLoadingSuggestions && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <Button 
                    onClick={() => handleAddLocation()}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    disabled={!newLocationName.trim()}
                  >
                    Add
                  </Button>
                </div>
                
                {/* Autocomplete Suggestions */}
                {showSuggestions && locationSuggestions.length > 0 && (
                  <Card className="absolute z-10 w-full mt-1 p-2 bg-white dark:bg-slate-900 border shadow-lg">
                    <ScrollArea className="max-h-60">
                      {locationSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleAddLocation(suggestion)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 dark:hover:bg-slate-800 rounded-lg text-left transition-colors"
                        >
                          <MapPin className="h-4 w-4 text-sky-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{suggestion.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {suggestion.admin1 ? `${suggestion.admin1}, ` : ""}{suggestion.country}
                            </p>
                          </div>
                        </button>
                      ))}
                    </ScrollArea>
                  </Card>
                )}
                
                <p className="text-xs text-muted-foreground mt-2">
                  Start typing to see location suggestions with live weather data
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Card */}
      <Card className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Favorite Locations */}
      {favoriteLocations.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            Favorite Locations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDeleteLocation}
                onSelect={handleSelectLocation}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Locations */}
      {otherLocations.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-sky-500" />
            All Locations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDeleteLocation}
                onSelect={handleSelectLocation}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredLocations.length === 0 && (
        <Card className="p-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/30 dark:border-slate-800/50">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No locations found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try a different search term" : "Add your first location to get started"}
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setIsAdding(true)}
                className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            )}
          </div>
        </Card>
      )}
    </motion.div>
  );
}

interface LocationCardProps {
  location: SavedLocation;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onSelect: (location: SavedLocation) => void;
}

function LocationCard({ location, onToggleFavorite, onDelete, onSelect }: LocationCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Card 
        className="p-4 bg-gradient-to-br from-white/90 to-sky-50/50 dark:from-slate-900/90 dark:to-sky-950/30 backdrop-blur-xl border-white/30 dark:border-slate-800/50 hover:shadow-lg transition-all cursor-pointer group"
        onClick={() => onSelect(location)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {location.name}
            </h4>
            <p className="text-xs text-muted-foreground">{location.country}</p>
          </div>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(location.id);
              }}
            >
              <Star 
                className={`h-4 w-4 ${
                  location.isFavorite 
                    ? "text-amber-500 fill-amber-500" 
                    : "text-muted-foreground"
                }`}
              />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(location.id, location.name);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-sky-500" />
            <div>
              <div className="text-2xl font-bold">{location.temperature}°</div>
              <div className="text-xs text-muted-foreground">{location.condition}</div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {location.lastUpdated}
          </Badge>
        </div>
      </Card>
    </motion.div>
  );
}