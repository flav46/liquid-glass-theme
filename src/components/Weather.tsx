import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import "./Weather.css";

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  location: string;
}

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  icon: string;
}

function Weather({ onClose, onFocus, isActive }: { onClose: () => void; onFocus?: () => void; isActive?: boolean }) {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 72,
    condition: "Sunny",
    icon: "☀️",
    humidity: 45,
    wind: 8,
    location: "San Francisco",
  });
  
  const [forecast, setForecast] = useState<ForecastDay[]>([
    { day: "Mon", high: 75, low: 58, icon: "☀️" },
    { day: "Tue", high: 72, low: 55, icon: "⛅" },
    { day: "Wed", high: 68, low: 52, icon: "🌧️" },
    { day: "Thu", high: 70, low: 54, icon: "⛅" },
    { day: "Fri", high: 73, low: 56, icon: "☀️" },
  ]);

  return (
    <Window
      title="Weather"
      icon="🌤️"
      isActive={isActive ?? true}
      defaultSize={{ width: 380, height: 480 }}
      minSize={{ width: 320, height: 400 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="weather-app">
        <div className="weather-current">
          <div className="weather-icon">{weather.icon}</div>
          <div className="weather-temp">{weather.temp}°F</div>
          <div className="weather-condition">{weather.condition}</div>
          <div className="weather-location">{weather.location}</div>
        </div>

        <div className="weather-details">
          <div className="weather-detail">
            <span>💧</span>
            <span>{weather.humidity}%</span>
          </div>
          <div className="weather-detail">
            <span>💨</span>
            <span>{weather.wind} mph</span>
          </div>
        </div>

        <div className="weather-forecast">
          {forecast.map((day, idx) => (
            <div key={idx} className="forecast-day">
              <span className="forecast-day-name">{day.day}</span>
              <span className="forecast-icon">{day.icon}</span>
              <span className="forecast-temps">{day.high}° / {day.low}°</span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

export default Weather;