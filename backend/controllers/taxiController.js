const axios = require('axios');
const config = require('../config/rapidApiConfig');
const Taxi = require('../models/Taxi'); // Import the Taxi model

// Function to search taxi location by query
exports.searchTaxiLocation = async (req, res) => {
  const { query, languagecode } = req.body;

  // Validate required parameters
  if (!query) {
    return res.status(400).json({
      status: false,
      message: 'Query parameter is required for taxi location search.',
    });
  }

  try {
    const options = {
      method: 'GET',
      url: `${config.booking.baseUrl}/api/v1/taxi/searchLocation`,
      params: {
        query,
        languagecode: languagecode || 'en-us', 
      },
      headers: {
        'x-rapidapi-key': config.booking.apiKey,
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
      },
    };

    const response = await axios.request(options);

    res.status(200).json({
      status: true,
      message: 'Success',
      data: response.data.data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to search taxi location',
      error: error.message,
    });
  }
};

// Function to search taxi between two locations and save the data to DB
exports.searchTaxi = async (req, res) => {
  const { pick_up_place_id, drop_off_place_id, pick_up_date, pick_up_time, currency_code, itinerary_id } = req.body;

  // Validate required parameters
  if (!pick_up_place_id || !drop_off_place_id || !pick_up_date || !pick_up_time) {
    return res.status(400).json({
      status: false,
      message: 'Required fields: pick_up_place_id, drop_off_place_id, pick_up_date, pick_up_time',
    });
  }

  try {
    const options = {
      method: 'GET',
      url: `${config.booking.baseUrl}/api/v1/taxi/searchTaxi`,
      params: {
        pick_up_place_id,
        drop_off_place_id,
        pick_up_date,
        pick_up_time,
        currency_code: currency_code || 'USD',
      },
      headers: {
        'x-rapidapi-key': config.booking.apiKey,
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
      },
    };

    const response = await axios.request(options);
    const taxiData = response.data.data.results; // Extract results

    // Save each result to the database
    for (const taxi of taxiData) {
      const newTaxi = new Taxi({
        itinerary_id,
        priceRuleId: taxi.priceRuleId,
        geniusDiscount: taxi.geniusDiscount,
        supplierName: taxi.supplierName,
        passengerCapacity: taxi.passengerCapacity,
        descriptionLocalised: taxi.descriptionLocalised,
        cancellationLeadTimeMinutes: taxi.cancellationLeadTimeMinutes,
        imageUrl: taxi.imageUrl,
        description: taxi.description,
        resultId: taxi.resultId,
        duration: taxi.duration,
        price: taxi.price,
        legPriceBreakdown: taxi.legPriceBreakdown,
        categoryLocalised: taxi.categoryLocalised,
        nonRefundable: taxi.nonRefundable,
        supplierId: taxi.supplierId,
        vehicleType: taxi.vehicleType,
        drivingDistance: taxi.drivingDistance,
        bags: taxi.bags,
        category: taxi.category,
        discountType: taxi.discountType,
        meetGreet: taxi.meetGreet,
        janusResultReference: taxi.janusResultReference,
        journeyDetails: response.data.data.journeys, // Save journey details
      });

      await newTaxi.save(); // Save to DB
    }

    res.status(200).json({
      status: true,
      message: 'Success',
      data: taxiData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to search taxis',
      error: error.message,
    });
  }
};
