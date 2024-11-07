import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = { lat: 23.8103, lng: 90.4125 };

const MapComponent = ({
  initialOrigin,
  initialDestination,
  initialStartDate,
  initialEndDate,
  readOnly = true,
  onTravelData = () => {}, // Callback to send travel data back to parent component
}) => {
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  // Fetch travel time and distance from Google Distance Matrix API
  const fetchDistanceAndDuration = async () => {
    if (!initialOrigin || !initialDestination) return;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${initialOrigin.lat},${initialOrigin.lng}&destinations=${initialDestination.lat},${initialDestination.lng}&key=`
      );

      const result = response.data.rows[0].elements[0];
      const distance = result.distance.text;
      const duration = result.duration.text;

      // Send travel data back to parent component
      onTravelData({ distance, duration });
    } catch (err) {
      // console.error('Error fetching travel data:', err);
      // setError('Failed to retrieve distance and duration');
    }
  };

  // Calculate the route using Directions API
  const calculateRoute = useCallback(() => {
    if (!initialOrigin || !initialDestination) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(initialOrigin.lat, initialOrigin.lng),
        destination: new window.google.maps.LatLng(initialDestination.lat, initialDestination.lng),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
        } else {
          setError('Could not calculate route');
        }
      }
    );
  }, [initialOrigin, initialDestination]);

  useEffect(() => {
    calculateRoute();
    fetchDistanceAndDuration();
  }, [calculateRoute]);

  return (
    <div className="rounded-lg overflow-hidden shadow-xl border-4 border-gray-100">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={initialOrigin || defaultCenter}
        zoom={7}
        onLoad={(map) => (mapRef.current = map)}
        options={{
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {initialOrigin && (
          <Marker
            position={initialOrigin}
            icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
          />
        )}
        {initialDestination && (
          <Marker
            position={initialDestination}
            icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
          />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default MapComponent;
