import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  LoadScript,
} from '@react-google-maps/api';
import { fetchWeatherData, checkWeatherAlerts } from './weatherService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const containerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = { lat: 23.8103, lng: 90.4125 };

const MapComponent = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [originWeather, setOriginWeather] = useState(null);
  const [destinationWeather, setDestinationWeather] = useState(null);
  const mapRef = useRef(null);

  // Fetch weather for a location
  const fetchLocationWeather = async (lat, lng, isOrigin = true) => {
    try {
      // Fetch weather for the specific date based on whether it's origin or destination
      const date = isOrigin ? startDate : endDate;
      const data = await fetchWeatherData(lat, lng, date);
      
      if (isOrigin) {
        setOriginWeather(data);
      } else {
        setDestinationWeather(data);
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
    }
  };
  // Handle map clicks
  const handleMapClick = useCallback(async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    if (!origin) {
      setOrigin({ lat, lng });
      fetchLocationWeather(lat, lng, true);
    } else if (!destination) {
      setDestination({ lat, lng });
      fetchLocationWeather(lat, lng, false);
    }
  }, [origin]);

  // Reset all points and data
  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
    setDirections(null);
    setDistance(null);
    setDuration(null);
    setOriginWeather(null);
    setDestinationWeather(null);
  };

  // Calculate route
  useEffect(() => {
    if (origin) {
      fetchLocationWeather(origin.lat, origin.lng, true);
    }
    if (destination) {
      fetchLocationWeather(destination.lat, destination.lng, false);
    }
  }, [startDate, endDate, origin, destination]);
  

  // Render weather alerts
  const renderWeatherAlerts = () => {
    if (!originWeather && !destinationWeather) return null;
  
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Weather Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Starting Point Weather */}
          {originWeather && (
            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <h3 className="font-semibold text-lg mb-2 text-blue-600">Starting Point</h3>
              <p className="text-sm text-gray-600 mb-3">
                Date: {new Date(startDate).toLocaleDateString()}
              </p>
              {checkWeatherAlerts(originWeather).map((alert, index) => (
                <div
                  key={`origin-${index}`}
                  className={`p-3 rounded-md mb-2 ${
                    alert.severity === 'extreme' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{alert.icon}</span>
                    <div>
                      <p>{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
  
          {/* Destination Point Weather */}
          {destinationWeather && (
            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <h3 className="font-semibold text-lg mb-2 text-red-600">Destination Point</h3>
              <p className="text-sm text-gray-600 mb-3">
                Date: {new Date(endDate).toLocaleDateString()}
              </p>
              {checkWeatherAlerts(destinationWeather).map((alert, index) => (
                <div
                  key={`dest-${index}`}
                  className={`p-3 rounded-md mb-2 ${
                    alert.severity === 'extreme' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{alert.icon}</span>
                    <div>
                      <p>{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <LoadScript googleMapsApiKey="AIzaSyAh2r1HyI0dXZzKfpjqGhCret0rb47LFeI" libraries={['places']}>
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Travel Route Planner</h1>
          
          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                dateFormat="MM/dd/yyyy"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                dateFormat="MM/dd/yyyy"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Weather Alerts */}
          {renderWeatherAlerts()}

          {/* Trip Info */}
          {distance && duration && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Distance</h3>
                <p className="text-2xl font-bold text-blue-600">{distance}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Duration</h3>
                <p className="text-2xl font-bold text-green-600">{duration}</p>
              </div>
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Reset Points
          </button>
        </div>

        {/* Map */}
        <div className="rounded-lg overflow-hidden shadow-xl border-4 border-gray-100">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={12}
            onClick={handleMapClick}
            onLoad={(map) => (mapRef.current = map)}
            options={{
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
            }}
          >
            {origin && (
              <Marker
                position={origin}
                label={{ text: "Start", className: "font-semibold" }}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                }}
              />
            )}
            {destination && (
              <Marker
                position={destination}
                label={{ text: "End", className: "font-semibold" }}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                }}
              />
            )}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: "#4F46E5",
                    strokeWeight: 5
                  }
                }}
              />
            )}
          </GoogleMap>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">How to use:</h3>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Select your travel dates using the date pickers above</li>
            <li>Click on the map to set your starting point (green marker)</li>
            <li>Click again to set your destination point (red marker)</li>
            <li>View weather alerts for both locations</li>
            <li>Use the reset button to start over if needed</li>
          </ol>
        </div>
      </div>
    </LoadScript>
  );
};

export default MapComponent;