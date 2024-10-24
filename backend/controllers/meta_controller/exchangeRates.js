const axios = require('axios');
const config = require('../../config/rapidApiConfig'); // Importing the RapidAPI config

// Function to fetch exchange rates from the API
exports.getExchangeRates = async (req, res) => {
  const { base_currency } = req.body; // Get base currency from query params

  try {
    const options = {
      method: 'GET',
      url: `${config.booking.baseUrl}/api/v1/meta/getExchangeRates`,
      params: {
        base_currency: base_currency, // Default to USD if no base currency is provided
      },
      headers: {
        'x-rapidapi-key': config.booking.apiKey, // Use the key from your config
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
      },
    };
    console.log(options);

    // Make the API request using axios
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
      message: 'Failed to fetch exchange rates',
      error: error.message,
    });
  }
};
