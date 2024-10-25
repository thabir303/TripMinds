import  { createContext, useContext, useState } from 'react';
import { AuthContext } from '../components/AuthContext'; // Correctly import the AuthContext

// Create the Itinerary Context
const ItineraryContext = createContext();

// Custom hook to use Itinerary context
export const useItinerary = () => useContext(ItineraryContext);

// Itinerary Provider Component
export const ItineraryProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // Correctly use the AuthContext to get the user
  const [itineraryId, setItineraryId] = useState(null); // State to store the current itinerary ID
  const [itineraries, setItineraries] = useState([]);   // State to store all user's itineraries

  return (
    <ItineraryContext.Provider
      value={{
        itineraryId,
        itineraries,
        setItineraryId,   // Use this in your page to store new itinerary ID
        setItineraries,   // Use this to store the new itinerary data
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};
