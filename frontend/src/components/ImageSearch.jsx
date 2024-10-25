// components/ImageSearch.jsx
import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import { debounce } from 'lodash';

const ImageSearch = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      onSearchResults([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:8000/search', {
        params: { query: searchQuery.trim() },
        headers: { 'Accept': 'application/json' }
      });

      console.log('Search response:', response.data); // Debug log

      if (response.data && response.data.status) {
        onSearchResults(response.data.data);
      } else if (response.data && response.data.data && response.data.data.length === 0) {
        setError('No matching images found');
        onSearchResults([]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.detail || 'Search failed. Please try again.');
      onSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchQuery) => handleSearch(searchQuery), 500),
    []
  );

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Search Images</h2>
        
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search by description, location, or content..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          
          {loading && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        )}

        {!loading && !error && query.trim() && (
          <div className="text-sm text-gray-600">
            Searching for images...
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSearch;