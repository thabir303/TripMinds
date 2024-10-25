const express = require('express');
const languagesController = require('../controllers/meta_controller/languages');
const currencyController = require('../controllers/meta_controller/currency');
const getExchangeRatesController = require('../controllers/meta_controller/exchangeRates');
const locationToLatLong = require('../controllers/meta_controller/location');
const router = express.Router();

// Define a route to fetch languages
router.get('/languages', languagesController.getLanguages);
router.get('/currency', currencyController.getCurrency);
router.get('/exchange-rate', getExchangeRatesController.getExchangeRates);
router.get('/location-details', locationToLatLong.getLocationToLatLong);

module.exports = router;
