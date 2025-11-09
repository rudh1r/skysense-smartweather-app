import { useState, useEffect, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AspectRatio } from "./ui/aspect-ratio";
import { MapPin, Thermometer, Wind, Cloud, CloudRain, Gauge } from "lucide-react";
import { toast } from "sonner";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMap,
} from "react-leaflet";

interface WeatherMapProps {
  currentLocation: {
    lat: number;
    lng: number;
    name: string;
  };
}

// Component to update map view when location changes
const ChangeView = memo(({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    // Invalidate size to fix any potential rendering issues on container resize
    map.invalidateSize();
  }, [map, center, zoom]);
  return null;
});

export function WeatherMap({ currentLocation }: WeatherMapProps) {
  const [activeLayer, setActiveLayer] = useState("temp_new");
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const handleTabChange = (value: string) => {
    const layerMap: Record<string, string> = {
      temperature: 'temp_new',
      wind: 'wind_new',
      precipitation: 'precipitation_new',
    };
    const layer = layerMap[value] || 'temp_new';
    setActiveLayer(layer);
  };

  if (!currentLocation) {
    return (
      <Card className="col-span-full lg:col-span-3 bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle>Interactive Weather Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[550px] w-full bg-muted rounded-xl flex items-center justify-center">
            <p>Waiting for location data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const position: [number, number] = [currentLocation.lat, currentLocation.lng];

  return (
    <Card className="col-span-full lg:col-span-3 bg-white/80 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Interactive Weather Map</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="temperature" onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/40">
            <TabsTrigger value="temperature" className="flex items-center space-x-2 text-sm">
              <Thermometer className="h-4 w-4" />
              <span className="hidden sm:inline">Temperature</span>
              <span className="sm:hidden">Temp</span>
            </TabsTrigger>
            <TabsTrigger value="wind" className="flex items-center space-x-2 text-sm">
              <Wind className="h-4 w-4" />
              <span>Wind</span>
            </TabsTrigger>
            <TabsTrigger value="precipitation" className="flex items-center space-x-2 text-sm">
              <CloudRain className="h-4 w-4" />
              <span className="hidden sm:inline">Precipitation</span>
              <span className="sm:hidden">Rain</span>
            </TabsTrigger>
          </TabsList>

          <AspectRatio ratio={1 / 0.709}>
            <div className="h-full w-full rounded-xl border-2 border-white/40 overflow-hidden">
              <MapContainer center={position} zoom={8} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
              <ChangeView center={position} zoom={8} />
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Street Map">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satellite View">
                   <TileLayer
                     url='https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                     maxZoom={20}
                     subdomains={['mt1','mt2','mt3']}
                   />
                </LayersControl.BaseLayer>
                <LayersControl.Overlay checked={activeLayer === 'temp_new'} name="Temperature">
                  <TileLayer
                    url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                    attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                  />
                </LayersControl.Overlay>
                <LayersControl.Overlay checked={activeLayer === 'wind_new'} name="Wind">
                  <TileLayer
                    url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                    attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                  />
                </LayersControl.Overlay>
                <LayersControl.Overlay checked={activeLayer === 'precipitation_new'} name="Precipitation">
                  <TileLayer
                    url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                    attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                  />
                </LayersControl.Overlay>
              </LayersControl>
              <Marker position={position}>
                <Popup>{currentLocation.name}</Popup>
              </Marker>
              </MapContainer>
            </div>
          </AspectRatio>
        </Tabs>
      </CardContent>
    </Card>
  );
}