const express = require('express');
const searchHotelDestination = require('../controllers/hotels_controller/searchHotelDestination'); 
const searchHotels = require('../controllers/hotels_controller/searchHotel');
const hotelDetails = require('../controllers/hotels_controller/hotelDetails');
const router = express.Router();

// Route for searching hotel destinations
router.get('/searchDestination', searchHotelDestination.searchHotelDestination);
router.get('/search-hotels', searchHotels.searchHotels);
router.get('/hotel-details', hotelDetails.getHotelDetails);

module.exports = router;
