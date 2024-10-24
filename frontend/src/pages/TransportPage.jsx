// pages/TransportPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MapComponent from '../components/MapComponent';

export const TransportPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Transport Planning</h1>
        <p className="text-gray-600 mt-2">Plan your journey and check weather conditions</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <nav className="flex border-b">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-6 py-4 ${
              activeTab === 'map'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Route Map
          </button>
          <button
            onClick={() => setActiveTab('options')}
            className={`px-6 py-4 ${
              activeTab === 'options'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Transport Options
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-6 py-4 ${
              activeTab === 'weather'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Weather Details
          </button>
        </nav>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'map' && (
            <div className="h-[600px]">
              <MapComponent />
            </div>
          )}

          {activeTab === 'options' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Public Transport</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-blue-700">
                    <span className="mr-2">🚌</span> Bus Routes Available
                  </li>
                  <li className="flex items-center text-blue-700">
                    <span className="mr-2">🚇</span> Metro Connections
                  </li>
                  <li className="flex items-center text-blue-700">
                    <span className="mr-2">🚂</span> Train Services
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Private Transport</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-green-700">
                    <span className="mr-2">🚗</span> Car Rentals
                  </li>
                  <li className="flex items-center text-green-700">
                    <span className="mr-2">🚕</span> Taxi Services
                  </li>
                  <li className="flex items-center text-green-700">
                    <span className="mr-2">🚲</span> Bike Rentals
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'weather' && (
            <div className="bg-gray-50 p-6 rounded-lg">
              {/* Weather information will be displayed here from MapComponent's weather data */}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Route
        </button>
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Share Details
        </button>
        <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          Export PDF
        </button>
      </div>
    </div>
  );
};