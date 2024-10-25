import  { useState, useEffect, useCallback, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  LoadScript,
} from '@react-google-maps/api';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from 'prop-types';

// Map container style
const containerStyle = {
  width: '100%',
  height: '600px',
};

// Default map center (Dhaka)
const defaultCenter = { lat: 23.8103, lng: 90.4125 };

const MapComponent = ({
  initialOrigin = defaultCenter,
  initialDestination = defaultCenter,
  initialStartDate = new Date(),
  initialEndDate = new Date(),
  readOnly = false,
  onWeatherData = () => {}, // Send weather data back to parent
}) => {
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  // Fetch weather data for a location
  const fetchWeatherData = async (lat, lng, isOrigin = true) => {
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=auto`
      );

      const weather = response.data.current_weather || {};
      console.log(`${isOrigin ? 'Origin' : 'Destination'} Weather:`, weather);

      // Send weather data to the parent component (TransportPage)
      onWeatherData((prevData) => ({
        ...prevData,
        [isOrigin ? 'origin' : 'destination']: weather,
      }));
    } catch (err) {
      console.error('Failed to fetch weather:', err);
    }
  };

  // Calculate route between origin and destination
  const calculateRoute = useCallback(() => {
    if (!origin || !destination) return;

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
          const route = result.routes[0].legs[0];
          setDistance(route.distance.text);
          setDuration(route.duration.text);
        } else {
          setError('Could not calculate route');
        }
      }
    );
  }, [origin, destination]);

  // Handle map clicks to set origin or destination
  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    if (!origin) {
      setOrigin({ lat, lng });
      fetchWeatherData(lat, lng, true);
    } else if (!destination) {
      setDestination({ lat, lng });
      fetchWeatherData(lat, lng, false);
    }
  }, [origin, destination]);

  // Reset the route and weather data
  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
    setDirections(null);
    setDistance(null);
    setDuration(null);
  };

  // Automatically calculate route when origin and destination change
  useEffect(() => {
    if (origin && destination) calculateRoute();
  }, [origin, destination, calculateRoute]);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAh2r1HyI0dXZzKfpjqGhCret0rb47LFeI"
      libraries={['places']}
    >
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-800 mb-4">Travel Route Planner</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="MM/dd/yyyy"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="MM/dd/yyyy"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

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

        <button
          onClick={handleReset}
          className="mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Reset Points
        </button>

        <div className="rounded-lg overflow-hidden shadow-xl border-4 border-gray-100">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={origin || defaultCenter}
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
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                }}
              />
            )}
            {destination && (
              <Marker
                position={destination}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                }}
              />
            )}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
};

// MapComponent.propTypes = {
//   initialOrigin: PropTypes.object,
//   initialDestination: PropTypes.object,
//   initialStartDate: PropTypes.instanceOf(Date),
//   initialEndDate: PropTypes.instanceOf(Date),
//   readOnly: PropTypes.bool,
//   onWeatherData: PropTypes.func,
// };

export default MapComponent;
