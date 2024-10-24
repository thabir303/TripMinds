// weatherService.js
import axios from 'axios';

export const fetchWeatherData = async (lat, lon, date) => {
  try {
    const formattedDate = date instanceof Date 
      ? date.toISOString().split('T')[0]
      : new Date(date).toISOString().split('T')[0];

    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${lat}&longitude=${lon}` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&current_weather=true` +
      `&start_date=${formattedDate}` +
      `&end_date=${formattedDate}` +
      `&timezone=auto`
    );

    return {
      current: response.data.current_weather,
      daily: response.data.daily,
      date: formattedDate
    };
  } catch (error) {
    console.error('Weather API Error:', error);
    throw new Error('Unable to fetch weather data.');
  }
};

export const checkWeatherAlerts = (weatherData) => {
  const alerts = [];
  const { current, daily, date } = weatherData;

  // Add current conditions
  if (current) {
    const currentWeather = weatherCodes[current.weathercode];
    if (currentWeather) {
      alerts.push({
        type: 'current',
        severity: currentWeather.severity,
        message: `Current condition: ${currentWeather.description}`,
        icon: getWeatherIcon(current.weathercode),
        date: new Date(date).toLocaleDateString()
      });
    }
  }

  // Add daily forecast alerts
  if (daily) {
    const { weathercode, precipitation_probability_max, temperature_2m_max, temperature_2m_min } = daily;
    
    // Only look at the specific date's forecast
    weathercode.forEach((code, index) => {
      const weather = weatherCodes[code];
      const precipProb = precipitation_probability_max[index];
      const maxTemp = temperature_2m_max[index];
      const minTemp = temperature_2m_min[index];

      if (weather && (weather.severity === 'high' || weather.severity === 'extreme')) {
        alerts.push({
          type: 'weather',
          severity: weather.severity,
          message: `${weather.description} expected`,
          icon: getWeatherIcon(code),
          date: new Date(date).toLocaleDateString()
        });
      }

      if (precipProb > 70) {
        alerts.push({
          type: 'precipitation',
          severity: 'medium',
          message: `High chance of precipitation (${precipProb}%)`,
          icon: '🌧️',
          date: new Date(date).toLocaleDateString()
        });
      }

      if (maxTemp > 35) {
        alerts.push({
          type: 'temperature',
          severity: 'high',
          message: `High temperature: ${maxTemp}°C`,
          icon: '🌡️',
          date: new Date(date).toLocaleDateString()
        });
      }

      if (minTemp < 5) {
        alerts.push({
          type: 'temperature',
          severity: 'high',
          message: `Low temperature: ${minTemp}°C`,
          icon: '❄️',
          date: new Date(date).toLocaleDateString()
        });
      }
    });
  }

  return alerts;
};


const weatherCodes = {
  0: { description: 'Clear sky', severity: 'low' },
  1: { description: 'Mainly clear', severity: 'low' },
  2: { description: 'Partly cloudy', severity: 'low' },
  3: { description: 'Overcast', severity: 'low' },
  45: { description: 'Foggy', severity: 'medium' },
  48: { description: 'Depositing rime fog', severity: 'medium' },
  51: { description: 'Light drizzle', severity: 'medium' },
  53: { description: 'Moderate drizzle', severity: 'medium' },
  55: { description: 'Dense drizzle', severity: 'high' },
  61: { description: 'Slight rain', severity: 'medium' },
  63: { description: 'Moderate rain', severity: 'medium' },
  65: { description: 'Heavy rain', severity: 'high' },
  66: { description: 'Light freezing rain', severity: 'high' },
  67: { description: 'Heavy freezing rain', severity: 'extreme' },
  71: { description: 'Slight snow fall', severity: 'medium' },
  73: { description: 'Moderate snow fall', severity: 'high' },
  75: { description: 'Heavy snow fall', severity: 'extreme' },
  77: { description: 'Snow grains', severity: 'medium' },
  80: { description: 'Slight rain showers', severity: 'medium' },
  81: { description: 'Moderate rain showers', severity: 'medium' },
  82: { description: 'Violent rain showers', severity: 'high' },
  85: { description: 'Slight snow showers', severity: 'medium' },
  86: { description: 'Heavy snow showers', severity: 'high' },
  95: { description: 'Thunderstorm', severity: 'extreme' },
  96: { description: 'Thunderstorm with slight hail', severity: 'extreme' },
  99: { description: 'Thunderstorm with heavy hail', severity: 'extreme' }
};

const getWeatherIcon = (code) => {
  const iconMap = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌦️',
    53: '🌦️',
    55: '🌧️',
    61: '🌧️',
    63: '🌧️',
    65: '⛈️',
    66: '🌨️',
    67: '🌨️',
    71: '🌨️',
    73: '🌨️',
    75: '❄️',
    77: '❄️',
    80: '🌦️',
    81: '🌧️',
    82: '⛈️',
    85: '🌨️',
    86: '❄️',
    95: '⛈️',
    96: '⛈️',
    99: '⛈️'
  };
  return iconMap[code] || '🌡️';
};