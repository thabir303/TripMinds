import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
}) => {
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  // Calculate route between origin and destination
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
