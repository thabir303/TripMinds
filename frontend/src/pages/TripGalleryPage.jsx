// pages/TripGalleryPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, Search, Album } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import ImageSearch from '../components/ImageSearch';
import ImageGallery from '../components/ImageGallery';

const TripGalleryPage = () => {
  const { id: tripId } = useParams();
  const [activeTab, setActiveTab] = useState('gallery');
  const [images, setImages] = useState([]);

  const handleImageUpload = (newImage) => {
    setImages(prev => [...prev, newImage]);
  };

  const handleSearchResults = (results) => {
    setImages(results);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {tripId ? 'Trip Gallery' : 'My Travel Gallery'}
        </h1>
        <p className="text-gray-600 mt-2">
          Organize and search through your travel memories
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <nav className="flex border-b">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-4 flex items-center ${
              activeTab === 'gallery'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Album className="w-5 h-5 mr-2" />
            Gallery
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-4 flex items-center ${
              activeTab === 'upload'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Photos
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-4 flex items-center ${
              activeTab === 'search'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Search className="w-5 h-5 mr-2" />
            Search Photos
          </button>
        </nav>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'gallery' && (
            <ImageGallery 
              title={tripId ? "Trip Photos" : "All Travel Photos"}
              images={images}
            />
          )}

          {activeTab === 'upload' && (
            <ImageUploader
              onImageUpload={handleImageUpload}
              onSuccess={() => setActiveTab('gallery')}
              tripId={tripId}
            />
          )}

          {activeTab === 'search' && (
            <ImageSearch onSearchResults={handleSearchResults} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TripGalleryPage;