import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface WeatherHeaderProps {
  currentLocation: string;
  onLocationSearch: (location: string) => void;
}

export function WeatherHeader({ 
  currentLocation, 
  onLocationSearch,
} : WeatherHeaderProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onLocationSearch(searchValue.trim());
      setSearchValue("");
    }
  };

  return (
    <div className="bg-gradient-to-r from-white/60 via-white/70 to-white/60 backdrop-blur-xl border-b border-white/30 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Mobile Layout - Stacked */}
        <div className="block sm:hidden space-y-3">
          {/* Search bar - full width on mobile */}
          <form onSubmit={handleSearch} className="w-full">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                <Input
                  placeholder="Search location..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-12 pr-4 py-4 text-base bg-white/90 border-2 border-blue-200/50 focus:bg-white focus:border-blue-400 text-gray-900 placeholder:text-blue-400 rounded-2xl backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200"
                />
              </div>
              <Button 
                type="submit" 
                size="sm" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 px-5 py-4 rounded-2xl backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Desktop Layout - Horizontal */}
        <div className="hidden sm:flex items-center justify-center">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
              <Input
                placeholder="Search for any city or location..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-12 w-72 lg:w-96 py-3 bg-white/90 border-2 border-blue-200/50 focus:bg-white focus:border-blue-400 text-gray-900 placeholder:text-blue-400 rounded-2xl backdrop-blur-sm shadow-md hover:shadow-lg focus:shadow-xl transition-all duration-200"
              />
            </div>
            <Button 
              type="submit" 
              size="sm" 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 px-6 py-3 rounded-2xl backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200"
            >
              Search
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}