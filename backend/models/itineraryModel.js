const itinerary = {
    destination: 'Saint Martin',
    locations: [
      { name: 'Dhaka', lat: 23.8103, lng: 90.4125 },
      { name: 'Cox\'s Bazar', lat: 21.4272, lng: 92.0058 },
      { name: 'Saint Martin', lat: 20.6275, lng: 92.3241 },
    ],
  };
  
  module.exports = {
    getItinerary: () => itinerary,
  };
  