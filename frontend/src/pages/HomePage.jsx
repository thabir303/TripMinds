// pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Plan Your Perfect Journey</h1>
        <p className="text-lg mb-6">Create detailed itineraries, check weather conditions, and plan your routes all in one place.</p>
        {!user ? (
          <div className="space-x-4">
            <Link to="/register" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Get Started
            </Link>
            <Link to="/login" className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Login
            </Link>
          </div>
        ) : (
          <Link to="/itinerary" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            View My Itineraries
          </Link>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl mb-4">🗺️</div>
          <h3 className="text-xl font-semibold mb-2">Interactive Maps</h3>
          <p className="text-gray-600">Plan your routes with real-time weather updates and traffic information.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl mb-4">📅</div>
          <h3 className="text-xl font-semibold mb-2">Itinerary Planning</h3>
          <p className="text-gray-600">Create and manage detailed travel itineraries with ease.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl mb-4">⛅</div>
          <h3 className="text-xl font-semibold mb-2">Weather Forecasts</h3>
          <p className="text-gray-600">Get accurate weather predictions for your travel dates.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;