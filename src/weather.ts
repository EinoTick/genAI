export interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

export interface WeatherResult {
  temperature: number;
  windspeed: number;
  description: string;
  feels: string;
}

const WMO_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Icy fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight showers',
  81: 'Moderate showers',
  82: 'Violent showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
};

// Helsinki coordinates
const LATITUDE = 60.1695;
const LONGITUDE = 24.9354;

export async function getCurrentWeather(): Promise<WeatherResult> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current_weather=true`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`);
  }

  const data = await response.json() as { current_weather: WeatherData };
  const w = data.current_weather;

  const description = WMO_CODES[w.weathercode] ?? 'Unknown conditions';

  let feels = 'comfortable';
  if (w.temperature < 0) feels = 'freezing cold';
  else if (w.temperature < 5) feels = 'very cold';
  else if (w.temperature < 10) feels = 'cold';
  else if (w.temperature < 15) feels = 'cool';
  else if (w.temperature < 20) feels = 'mild';
  else if (w.temperature < 25) feels = 'warm';
  else feels = 'hot';

  return {
    temperature: w.temperature,
    windspeed: w.windspeed,
    description,
    feels,
  };
}
