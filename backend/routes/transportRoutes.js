const express = require('express');
const carController = require('../controllers/carController');
const taxiController = require('../controllers/taxiController');

const router = express.Router();

// Route to search car rentals
router.get('/searchCarRentals', carController.searchCarRentals);

// Route to get vehicle details
router.get('/getVehicleDetails', carController.getVehicleDetails);

// Route to search taxi locations
router.get('/searchTaxiLocation', taxiController.searchTaxiLocation);

// Route to search taxis between two locations
router.get('/searchTaxi', taxiController.searchTaxi);

module.exports = router;
