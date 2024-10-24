const axios = require('axios');
const config = require('../config/rapidApiConfig'); // Importing the RapidAPI config

// Function to search car rentals by required parameters from the request body
exports.searchCarRentals = async (req, res) => {
  const {
    pick_up_latitude,
    pick_up_longitude,
    drop_off_latitude,
    drop_off_longitude,
    pick_up_date,
    drop_off_date,
    pick_up_time,
    drop_off_time
  } = req.body; // Extract required parameters from the request body

  // Validate required parameters
  if (
    !pick_up_latitude ||
    !pick_up_longitude ||
    !drop_off_latitude ||
    !drop_off_longitude ||
    !pick_up_date ||
    !drop_off_date ||
    !pick_up_time ||
    !drop_off_time
  ) {
    return res.status(400).json({
      status: false,
      message: 'All fields are required: pick_up_latitude, pick_up_longitude, drop_off_latitude, drop_off_longitude, pick_up_date, drop_off_date, pick_up_time, drop_off_time.',
    });
  }

  try {
    const options = {
      method: 'GET',
      url: `${config.booking.baseUrl}/api/v1/cars/searchCarRentals`,
      params: {
        pick_up_latitude,
        pick_up_longitude,
        drop_off_latitude,
        drop_off_longitude,
        pick_up_date,
        drop_off_date,
        pick_up_time,
        drop_off_time,
      },
      headers: {
        'x-rapidapi-key': config.booking.apiKey, // API key from config
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
      },
    };

    // Make the API request using axios
    const response = await axios.request(options);

    // Send the API response back to the client
    res.status(200).json({
      status: true,
      message: 'Success',
      data: response.data.data, // Extract the "data" from the API response
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      status: false,
      message: 'Failed to search car rentals',
      error: error.message,
    });
  }
};

// Function to get vehicle details
exports.getVehicleDetails = async (req, res) => {
  const { vehicle_id, search_key } = req.body; // Extract required parameters from the request body

  // Validate required parameters
  if (!vehicle_id || !search_key) {
    return res.status(400).json({
      status: false,
      message: 'Both vehicle_id and search_key are required fields.',
    });
  }

  try {
    const options = {
      method: 'GET',
      url: `${config.booking.baseUrl}/api/v1/cars/vehicleDetails`,
      params: {
        vehicle_id,
        search_key,
        units: 'metric',        // Optional parameter, can be set to default
        currency_code: 'USD',   // Optional, default currency
        languagecode: 'en-us',  // Optional, default language code
      },
      headers: {
        'x-rapidapi-key': config.booking.apiKey, // API key from config
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
      },
    };

    // Make the API request using axios
    const response = await axios.request(options);

    // Send the API response back to the client
    res.status(200).json({
      status: true,
      message: 'Success',
      data: response.data.data, // Extract the "data" from the API response
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      status: false,
      message: 'Failed to fetch vehicle details',
      error: error.message,
    });
  }
};

