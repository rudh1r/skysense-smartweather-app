import { createContext, useContext, useState, ReactNode } from 'react';
import { type WeatherUnits } from '@/lib/unit-conversions';

interface SettingsContextType {
  units: WeatherUnits;
  setUnits: React.Dispatch<React.SetStateAction<WeatherUnits>>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useState<WeatherUnits>({
    temperature: 'celsius',
    windSpeed: 'kmh',
    pressure: 'hpa',
    precipitation: 'mm',
    visibility: 'km'
  });

  return (
    <SettingsContext.Provider value={{ units, setUnits }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}