import  { useEffect, useState } from 'react';
import MapComponent from '../src/components/MapComponent';
import axios from 'axios';

const ItineraryView = () => {
  const [itinerary, setItinerary] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/itinerary')
      .then(response => setItinerary(response.data))
      .catch(error => console.error('Error fetching itinerary:', error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Travel Itinerary</h1>
      {itinerary ? <MapComponent locations={itinerary.locations} /> : 'Loading...'}
    </div>
  );
};

export default ItineraryView;
