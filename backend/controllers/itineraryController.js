const { getItinerary } = require('../models/itineraryModel');

// Controller function to handle itinerary retrieval
const fetchItinerary = (req, res) => {
  const itinerary = getItinerary();
  res.status(200).json(itinerary);
};

module.exports = { fetchItinerary };
