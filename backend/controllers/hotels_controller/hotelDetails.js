const axios = require('axios');
const config = require('../../config/rapidApiConfig'); // Importing the RapidAPI config

// Function to get hotel details by hotel_id
exports.getHotelDetails = async (req, res) => {
  const { hotel_id, arrival_date, departure_date } = req.body; // Extract required parameters from the request body

  // Validate required parameters
  if (!hotel_id || !arrival_date || !departure_date) {
    return res.status(400).json({
      status: false,
      message: 'hotel_id, arrival_date, and departure_date are required fields.',
    });
  }

  try {
    const options = {
      method: 'GET',
      url: `${config.booking.baseUrl}/api/v1/hotels/getHotelDetails`,
      params: {
        hotel_id,
        arrival_date,
        departure_date
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
      message: 'Failed to fetch hotel details',
      error: error.message,
    });
  }
};
