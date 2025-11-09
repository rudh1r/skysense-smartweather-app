export const celsiusToFahrenheit = (celsius: number): number => {
  return Math.round((celsius * 9) / 5 + 32);
};

export const kmhToMph = (kmh: number): number => {
  return Math.round(kmh / 1.609);
};

export const hpaToInhg = (hpa: number): number => {
  return parseFloat((hpa * 0.02953).toFixed(2));
};

export const mmToInches = (mm: number): number => {
  return parseFloat((mm / 25.4).toFixed(2));
};

export const kmToMiles = (km: number): number => {
  return Math.round(km / 1.609);
};

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms' | 'knots';
export type PressureUnit = 'hpa' | 'inhg' | 'mmhg';
export type PrecipitationUnit = 'mm' | 'inches';
export type VisibilityUnit = 'km' | 'miles';

export type WeatherUnits = {
  temperature: TemperatureUnit;
  windSpeed: WindSpeedUnit;
  pressure: PressureUnit;
  precipitation: PrecipitationUnit;
  visibility: VisibilityUnit;
};