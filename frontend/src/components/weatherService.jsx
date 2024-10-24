import axios from 'axios';

export const fetchWeatherData = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    const data = response.data;
    if (data && data.current_weather) {
      return data.current_weather;
    } else {
      throw new Error('No weather data available');
    }
  } catch (error) {
    console.error('Weather API Error:', error);
    throw new Error('Unable to fetch weather data.');
  }
};
