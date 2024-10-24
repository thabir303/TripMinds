import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  LoadScript,
  InfoWindow,
} from '@react-google-maps/api';
import { fetchWeatherData } from './weatherService'; // Import weather service

const containerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = { lat: 23.8103, lng: 90.4125 }; // Dhaka, Bangladesh

const MapComponent = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [weather, setWeather] = useState(null);

  const mapRef = useRef(null);

  // Handle map clicks to set origin and destination
  const handleMapClick = useCallback(async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    if (!origin) {
      setOrigin({ lat, lng });
    } else {
      setDestination({ lat, lng });
      const weatherData = await fetchWeatherData(lat, lng); // Fetch weather
      setWeather(weatherData);
    }
  }, [origin]);

  // Calculate directions when origin and destination are set
  useEffect(() => {
    if (origin && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: new window.google.maps.LatLng(origin.lat, origin.lng),
          destination: new window.google.maps.LatLng(destination.lat, destination.lng),
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result);
            const leg = result.routes[0].legs[0]; // Get the first route's leg
            setDistance(leg.distance.text);
            setDuration(leg.duration.text);
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
    }
  }, [origin, destination]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyAh2r1HyI0dXZzKfpjqGhCret0rb47LFeI" libraries={['places']}>
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Travel Route Planner</h1>

        {/* Distance and Duration Display */}
        {distance && duration && (
          <div className="grid grid-cols-2 gap-4 mb-6">
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

        {/* Weather Information */}
        {weather && (
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-yellow-800">Current Weather</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {weather.temperature}°C, {weather.weathercode === 0 ? 'Clear' : 'Cloudy'}
            </p>
          </div>
        )}

        {/* Map Container */}
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
            }}
          >
            {/* Origin Marker */}
            {origin && (
              <Marker
                position={origin}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                  scaledSize: { width: 40, height: 40 },
                }}
                label={{ text: 'Start', className: 'font-semibold' }}
              />
            )}

            {/* Destination Marker */}
            {destination && (
              <Marker
                position={destination}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: { width: 40, height: 40 },
                }}
                label={{ text: 'End', className: 'font-semibold' }}
              />
            )}

            {/* Route Directions */}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: '#4F46E5',
                    strokeWeight: 5,
                  },
                }}
              />
            )}
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
};

export default MapComponent;
