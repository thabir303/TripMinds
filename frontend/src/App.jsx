// App.jsx
// import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/HomePage';
import ItineraryPage from './pages/ItineraryPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './components/AuthContext';
import { ItineraryProvider } from './contexts/itineraryContext';
import { TransportPage } from './pages/TransportPage';

function App() {
  return (
    <AuthProvider>
      <ItineraryProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-6" style={{ marginTop: '80px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/itinerary" element={<ItineraryPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/itinerary/:id/transport" element={<TransportPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ItineraryProvider>
    </AuthProvider>
  );
}

export default App;