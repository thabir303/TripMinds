// components/TaxiSearch.jsx
import React, { useState, useEffect } from 'react';
import { useText } from '../contexts/TextContext';
import { taxiService } from '../services/taxiService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const TaxiSearch = ({ itineraryId, onTaxiSelect }) => {
  // State management
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTaxi, setSelectedTaxi] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState({
    pickup: [],
    dropoff: []
  });

  const { savedText, updateText } = useText();

  // Location search handler
  const handleLocationSearch = async (query, type) => {
    try {
      setLoading(true);
      const response = await taxiService.searchLocation(query);
      setLocationSuggestions(prev => ({
        ...prev,
        [type]: response.data
      }));
    } catch (error) {
      setError('Failed to fetch location suggestions');
    } finally {
      setLoading(false);
    }
  };

  // Search taxis handler
  const handleTaxiSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = {
        pick_up_place_id: pickupLocation.id,
        drop_off_place_id: dropoffLocation.id,
        pick_up_date: pickupDate.toISOString().split('T')[0],
        pick_up_time: pickupTime,
        itinerary_id: itineraryId
      };

      const response = await taxiService.searchTaxis(searchParams);
      setSearchResults(response.data);

      // Add notes about the search
      const searchNote = `Taxi search performed:\nFrom: ${pickupLocation.name}\nTo: ${dropoffLocation.name}\nDate: ${pickupDate.toLocaleDateString()}\nTime: ${pickupTime}`;
      updateText(searchNote);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Find a Taxi</h2>

      {/* Search Form */}
      <div className="space-y-4 mb-6">
        {/* Pickup Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={pickupLocation.name || ''}
              onChange={(e) => handleLocationSearch(e.target.value, 'pickup')}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter pickup location"
            />
            {locationSuggestions.pickup.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                {locationSuggestions.pickup.map((location) => (
                  <div
                    key={location.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setPickupLocation(location);
                      setLocationSuggestions(prev => ({ ...prev, pickup: [] }));
                    }}
                  >
                    {location.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dropoff Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dropoff Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={dropoffLocation.name || ''}
              onChange={(e) => handleLocationSearch(e.target.value, 'dropoff')}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter dropoff location"
            />
            {locationSuggestions.dropoff.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                {locationSuggestions.dropoff.map((location) => (
                  <div
                    key={location.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setDropoffLocation(location);
                      setLocationSuggestions(prev => ({ ...prev, dropoff: [] }));
                    }}
                  >
                    {location.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Date
            </label>
            <DatePicker
              selected={pickupDate}
              onChange={setPickupDate}
              minDate={new Date()}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Time
            </label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleTaxiSearch}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Searching...' : 'Search Taxis'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Available Taxis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((taxi) => (
              <div
                key={taxi.resultId}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTaxi?.resultId === taxi.resultId
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedTaxi(taxi);
                  onTaxiSelect?.(taxi);
                }}
              >
                <div className="flex items-center space-x-4">
                  {taxi.imageUrl && (
                    <img
                      src={taxi.imageUrl}
                      alt={taxi.description}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {taxi.supplierName}
                    </h4>
                    <p className="text-sm text-gray-600">{taxi.description}</p>
                    <div className="mt-2">
                      <span className="text-lg font-bold text-blue-600">
                        ${taxi.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({taxi.duration} mins)
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      <span>👥 {taxi.passengerCapacity} passengers</span>
                      <span className="ml-3">🧳 {taxi.bags} bags</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Section */}
      {savedText && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Search Notes</h4>
          <p className="text-gray-600 whitespace-pre-wrap">{savedText}</p>
        </div>
      )}
    </div>
  );
};

export default TaxiSearch;