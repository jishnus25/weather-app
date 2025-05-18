import React, { useState } from 'react';
import './Weather.css';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');

  const getWeatherIcon = (weatherMain) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '🌨️',
      'Mist': '🌫️',
      'Smoke': '🌫️',
      'Haze': '🌫️',
      'Dust': '🌫️',
      'Fog': '🌫️',
    };
    return icons[weatherMain] || '🌈';
  };

  const search = async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    try {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${import.meta.env.VITE_API_KEY}`;
  
      console.log(URL);
      
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'City not found. Please check the spelling.' : 'Failed to fetch weather data');
      }
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    search(city);
  };

  return (
    <div className="weather">
      <h2>Weather App</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {weather && !loading && !error && (
        <div className="weather-info">
          <div className="weather-header">
            <h3>{weather.name}, {weather.sys?.country}</h3>
            <span className="weather-icon">
              {getWeatherIcon(weather.weather?.[0]?.main)}
            </span>
          </div>
          <div className="weather-details">
            <div className="weather-temp">
              <span className="temperature">{Math.round(weather.main?.temp)}°C</span>
              <span className="feels-like">Feels like: {Math.round(weather.main?.feels_like)}°C</span>
            </div>
            <div className="weather-stats">
              <div className="stat">
                <span className="stat-label">Weather</span>
                <span className="stat-value">{weather.weather?.[0]?.main}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Humidity</span>
                <span className="stat-value">{weather.main?.humidity}%</span>
              </div>
              <div className="stat">
                <span className="stat-label">Wind</span>
                <span className="stat-value">{weather.wind?.speed} m/s</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;