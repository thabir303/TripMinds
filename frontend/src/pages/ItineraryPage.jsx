import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useItinerary } from '../contexts/itineraryContext';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const ItineraryPage = () => {
  const navigate = useNavigate();
  const { user, getToken } = useAuth();
  const { itineraryId, setItineraryId, setItineraries } = useItinerary();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itineraryGenerated, setItineraryGenerated] = useState(false);
  
  const [formData, setFormData] = useState({
    currentLocation: '',
    destination: '',
    travelTime: '',
    travelDate: '',
  });

  // Check authentication on mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null); // Clear any previous errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      if (!formData.currentLocation || !formData.destination || !formData.travelTime || !formData.travelDate) {
        throw new Error('Please fill in all fields');
      }
  
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }
  
      // Call the itinerary store API
      const response = await axios.post(
        'http://localhost:3000/api/itinerary/store',
        {
          ...formData,
          username: user.username,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const { data } = response.data;
  
      // Store the itinerary ID and update the state
      setItineraryId(data._id);
      setItineraries(prev => [...prev, data]);
      setIsFormOpen(false);
      setItineraryGenerated(true);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while creating the itinerary');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Plan Your Itinerary
      </h1>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center mb-6">
        {!isFormOpen && !itineraryGenerated && (
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
            onClick={() => setIsFormOpen(true)}
          >
            Generate Itinerary
          </button>
        )}

        {itineraryGenerated && (
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
            onClick={() => setIsFormOpen(true)}
          >
            Change Itinerary
          </button>
        )}
      </div>

      {/* Itinerary Form */}
      {isFormOpen && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Itinerary Generator
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="currentLocation">
                  Current Location
                </label>
                <input
                  type="text"
                  id="currentLocation"
                  name="currentLocation"
                  value={formData.currentLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your current location"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="destination">
                  Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your destination"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="travelTime">
                  Preferred Start Time
                </label>
                <input
                  type="time"
                  id="travelTime"
                  name="travelTime"
                  value={formData.travelTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="travelDate">
                  Date of Travel
                </label>
                <input
                  type="date"
                  id="travelDate"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 bg-green-500 text-white rounded-lg ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
                } transition-colors`}
              >
                {isLoading ? 'Generating...' : 'Generate Itinerary'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Generated Itinerary Actions */}
      {itineraryGenerated && !isFormOpen && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to={`/itinerary/${itineraryId}/transport`}
              className="flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
            >
              <span className="mr-2">🚗</span> Transport
            </Link>
            <Link
              to="/accommodation"
              className="flex items-center justify-center p-4 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 transition-colors"
            >
              <span className="mr-2">🏨</span> Accommodation
            </Link>
            <Link
              to="/food"
              className="flex items-center justify-center p-4 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors"
            >
              <span className="mr-2">🍽️</span> Food
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryPage;
