import React, { useState, useCallback } from "react";
import { debounce } from "lodash";
import { Search } from 'lucide-react';
import ImageGallery from "./ImageGallery";

const ImageSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const performSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost:8000/search?query=${encodeURIComponent(searchQuery)}`
        );
        
        if (!response.ok) throw new Error("Search failed");
        
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError("Failed to search images. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    performSearch(newQuery);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Search Images</h2>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Search images..."
          value={query}
          onChange={handleQueryChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <ImageGallery 
          title="Search Results" 
          images={results.map(result => ({
            imageUrl: result.caption.imageUrl,
            caption: result.caption.caption,
            album: result.caption.album,
            similarity: result.similarity
          }))} 
        />
      )}

      {!isLoading && query && results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
};

export default ImageSearch;