const axios = require('axios');
const config = require('../../config/rapidApiConfig'); // Importing the RapidAPI config

// Function to fetch Lat and Long from location query
exports.getLocationToLatLong = async (req, res) => {
  const { query } = req.body // Get query parameter from the request

  // if (!query) {
  //   return res.status(400).json({
  //     status: false,
  //     message: 'Query parameter is required',
  //   });
  // }

  try {
    const options = {
      method: 'GET',
      url: `${config.booking.baseUrl}/api/v1/meta/locationToLatLong`,
      params: {
        query: query, // Pass the location query from the request
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
      message: 'Failed to fetch location data',
      error: error.message,
    });
  }
};
