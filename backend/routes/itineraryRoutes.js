const express = require('express');
const router = express.Router();
const { fetchItinerary } = require('../controllers/itineraryController');

// Route to get the itinerary data
router.get('/itinerary', fetchItinerary);

module.exports = router;
