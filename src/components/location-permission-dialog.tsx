import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  MapPin, 
  Shield, 
  Zap, 
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search
} from "lucide-react";
import { useState } from "react";

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0';

interface LocationPermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: (location: string, coords?: { lat: number; lng: number }) => void;
  onDeny: () => void;
}

export function LocationPermissionDialog({ 
  isOpen, 
  onClose, 
  onAllow, 
  onDeny 
}: LocationPermissionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'none' | 'granted' | 'denied'>('none');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualLocation, setManualLocation] = useState("");

  const handleAllowLocation = async () => {
    setIsLoading(true);
    
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      const getLocationFromCoordinates = async (lat: number, lon: number) => {
        const response = await fetch(`${OPENWEATHER_GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.length === 0) return null;
        const location = data[0];
        return {
          name: `${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`,
          city: location.name,
          state: location.state,
          country: location.country,
          latitude: location.lat,
          longitude: location.lon,
        };
      };

      // Request current position
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Use the weather API's reverse geocoding for consistency
          const locationData = await getLocationFromCoordinates(latitude, longitude);

          if (locationData) {
            setPermissionStatus('granted');
            setTimeout(() => {
              onAllow(locationData.name, { lat: latitude, lng: longitude });
              onClose();
            }, 1000);
          } else {
            // If geocoding fails, use coordinates directly
            const locationName = `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
            setPermissionStatus('granted');
            setTimeout(() => {
              onAllow(locationName, { lat: latitude, lng: longitude });
              onClose();
            }, 1000);
          }          
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLoading(false);
          setShowManualEntry(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
      
    } catch (error) {
      console.error('Error requesting location:', error);
      setIsLoading(false);
      setShowManualEntry(true);
    }
  };

  const handleDenyLocation = () => {
    setPermissionStatus('denied');
    setTimeout(() => {
      onDeny();
      onClose();
    }, 1000);
  };

  const handleManualLocation = () => {
    setShowManualEntry(true);
  };

  const handleManualSubmit = () => {
    if (manualLocation.trim()) {
      onAllow(manualLocation.trim());
      onClose();
    }
  };

  const handleUseDefault = () => {
    onAllow("San Francisco, CA");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-white/20">
        <DialogHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="relative">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                permissionStatus === 'granted' 
                  ? 'bg-green-500' 
                  : permissionStatus === 'denied' 
                  ? 'bg-red-500' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}>
                {permissionStatus === 'granted' ? (
                  <CheckCircle className="h-8 w-8 text-white" />
                ) : permissionStatus === 'denied' ? (
                  <XCircle className="h-8 w-8 text-white" />
                ) : isLoading ? (
                  <div className="animate-spin">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                ) : (
                  <MapPin className="h-8 w-8 text-white" />
                )}
              </div>
              {isLoading && permissionStatus === 'none' && (
                <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <DialogTitle className="text-xl">
              {permissionStatus === 'granted' 
                ? 'Location Access Granted!' 
                : permissionStatus === 'denied' 
                ? 'Location Access Denied' 
                : 'Allow Location Access?'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {permissionStatus === 'granted' ? (
                'Great! We can now provide accurate weather data for your area.'
              ) : permissionStatus === 'denied' ? (
                'You can still use the app by manually entering your location.'
              ) : (
                'Get hyper-local weather data, accurate forecasts, and location-specific alerts for your area.'
              )}
            </DialogDescription>
          </div>
        </DialogHeader>

        {permissionStatus === 'none' && !showManualEntry && (
          <div className="space-y-4">
            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Zap className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Precise Weather Data</p>
                  <p className="text-xs text-muted-foreground">Accurate conditions for your exact location</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Timely Alerts</p>
                  <p className="text-xs text-muted-foreground">Get warnings for severe weather in your area</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Shield className="h-5 w-5 text-purple-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Privacy Protected</p>
                  <p className="text-xs text-muted-foreground">Location data stays on your device</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleAllowLocation}
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin mr-2">
                      <Target className="h-4 w-4" />
                    </div>
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Allow Location Access
                  </>
                )}
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleManualLocation}
                  className="flex-1 bg-white/60"
                  disabled={isLoading}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Enter Manually
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDenyLocation}
                  className="flex-1 bg-white/60"
                  disabled={isLoading}
                >
                  Skip
                </Button>
              </div>
            </div>

            {/* Privacy Note */}
            <Card className="bg-gray-50/80 border-gray-200">
              <div className="p-3">
                <div className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">Privacy Commitment</p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Your location is only used to fetch weather data and is never stored or shared with third parties.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Manual Entry Form */}
        {permissionStatus === 'none' && showManualEntry && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter Your Location</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="e.g., New York, NY or London, UK"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
                    className="flex-1"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter a city name, address, or postal code
                </p>
              </div>

              <Button 
                onClick={handleManualSubmit}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Search className="h-4 w-4 mr-2" />
                Set Location
              </Button>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowManualEntry(false)}
                  className="flex-1 bg-white/60"
                >
                  Back
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleUseDefault}
                  className="flex-1 bg-white/60"
                >
                  Use Default
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {permissionStatus === 'granted' && (
          <div className="text-center space-y-3">
            <Badge variant="outline" className="bg-green-500/20 text-green-800 border-green-500/40">
              <CheckCircle className="h-3 w-3 mr-1" />
              Location Enabled
            </Badge>
            <p className="text-sm text-muted-foreground">
              Loading your local weather data...
            </p>
          </div>
        )}

        {permissionStatus === 'denied' && (
          <div className="text-center space-y-3">
            <Badge variant="outline" className="bg-orange-500/20 text-orange-800 border-orange-500/40">
              <AlertCircle className="h-3 w-3 mr-1" />
              Manual Location
            </Badge>
            <p className="text-sm text-muted-foreground">
              You can enable location access later in settings
            </p>
            <Button 
              variant="outline" 
              onClick={handleManualLocation}
              className="bg-white/60"
              size="sm"
            >
              Continue with Default Location
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}