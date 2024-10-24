const axios = require('axios');
const config = require('../../config/rapidApiConfig'); // Importing the RapidAPI config

// Function to fetch currencies from the API
exports.getCurrency = async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: `${config.booking.baseUrl}/api/v1/meta/getCurrency`, // API URL from config
      headers: {
        'x-rapidapi-key': config.booking.apiKey, // Use your key from config
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
      },
    };
    console.log(options);

    // Make the API request
    const response = await axios.request(options);

    // Send the API response back to the client
    res.status(200).json({
      status: true,
      message: 'Success',
      data: response.data.data, // Extracting the "data" from the response
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      status: false,
      message: 'Failed to fetch currencies',
      error: error.message,
    });
  }
};
