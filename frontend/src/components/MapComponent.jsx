import React, { useState, useEffect, useCallback } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  LoadScript,
} from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const mapStyles = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#e9e9e9' }, { lightness: 17 }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }, { lightness: 20 }],
  },
];

const MapComponent = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');

  const geocodeAddress = async (address, setPoint) => {
    const apiKey = 'AIzaSyAh2r1HyI0dXZzKfpjqGhCret0rb47LFeI';
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );
    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      setPoint(location);
    } else {
      alert('Location not found!');
    }
  };

  // Calculate the route when both origin and destination are set
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
            const route = result.routes[0].legs[0];
            setDistance(route.distance.text);
            setDuration(route.duration.text);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Travel Route Planner</h1>

          {/* Search Inputs for Origin and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Starting Point</label>
              <div className="flex mt-1">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-l px-4 py-2"
                  placeholder="Enter starting place"
                  value={originInput}
                  onChange={(e) => setOriginInput(e.target.value)}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-r"
                  onClick={() => geocodeAddress(originInput, setOrigin)}
                >
                  Search
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Destination Point</label>
              <div className="flex mt-1">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-l px-4 py-2"
                  placeholder="Enter destination place"
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value)}
                />
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-r"
                  onClick={() => geocodeAddress(destinationInput, setDestination)}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Distance and Duration Display */}
          {distance && duration && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-1">Distance</h3>
                <p className="text-2xl font-bold text-blue-600">{distance}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-1">Duration</h3>
                <p className="text-2xl font-bold text-green-600">{duration}</p>
              </div>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="rounded-lg overflow-hidden shadow-xl border-4 border-gray-100">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={origin || { lat: 23.8103, lng: 90.4125 }}
            zoom={12}
            options={{
              styles: mapStyles,
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

            {/* Directions Renderer */}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true,
                  polylineOptions: { strokeColor: '#4F46E5', strokeWeight: 5 },
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
