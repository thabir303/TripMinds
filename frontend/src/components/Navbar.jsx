// components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { Camera, Map, Book } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            TripMinds
          </Link>

          {user && (
            <div className="flex items-center space-x-6">
              <Link 
                to="/itinerary" 
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <Map className="w-5 h-5 mr-1" />
                <span>Itinerary</span>
              </Link>
              
              <Link 
                to="/gallery" 
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <Camera className="w-5 h-5 mr-1" />
                <span>Trip Gallery</span>
              </Link>

              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Hello, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {!user && (
            <div className="space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;