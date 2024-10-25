const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

// Routes for creating and fetching itineraries
router.post('/create', itineraryController.createItinerary); // Create new itinerary
router.get('/:id', itineraryController.getItineraryById); // Get itinerary by ID
router.put('/:id/update', itineraryController.updateItineraryFields); // Update required fields

// Routes for adding optional fields
router.post('/:id/add-hotel', itineraryController.addHotelToItinerary); // Add hotel to itinerary
router.post('/:id/add-restaurant', itineraryController.addRestaurantToItinerary); // Add restaurant to itinerary
router.post('/:id/add-food', itineraryController.addFoodToItinerary); // Add food to itinerary
router.post('/:id/add-image', itineraryController.addImageToItinerary); // Add image to itinerary

// Get all itineraries for a specific user
router.get('/user/:username/itineraries', itineraryController.getUserItineraries);

// Route to update latitude and longitude
router.put('/:id/update-latlong', itineraryController.updateItineraryLatLong);

// New route to store pre-filled itinerary responses
router.post('/store', itineraryController.storeItinerary); // Store new itineraries

module.exports = router;
