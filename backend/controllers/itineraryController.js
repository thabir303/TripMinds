const Itinerary = require('../models/Itinerary');
const axios = require('axios');


// Create a new itinerary with required fields
exports.createItinerary = async (req, res) => {
  const { username, currentLocation, destination, travelTime, travelDate } = req.body;

  // Validate required fields
  if (!username || !currentLocation || !destination || !travelTime || !travelDate) {
    return res.status(400).json({
      status: false,
      message: 'Required fields are missing. Please provide username, currentLocation, destination, travelTime, and travelDate.',
    });
  }

  try {
    const newItinerary = new Itinerary({
      username,
      currentLocation,
      destination,
      travelTime,
      travelDate, // Default to 'budget' if not provided
    });

    // Save the itinerary to the database
    const savedItinerary = await newItinerary.save();

    // Return success response with the itinerary ID
    res.status(201).json({
        status: true,
        message: 'Itinerary created successfully.',
        itineraryId: savedItinerary._id, // Return the ID of the newly created itinerary
        data: savedItinerary
      });
      
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to create itinerary.',
      error: error.message,
    });
  }
};

// Get itinerary details by ID
exports.getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id).populate('images');
    if (!itinerary) {
      return res.status(404).json({ status: false, message: 'Itinerary not found.' });
    }
    res.status(200).json({ status: true, data: itinerary });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch itinerary details.',
      error: error.message,
    });
  }
};

// Update required fields (e.g., currentLocation, destination)
exports.updateItineraryFields = async (req, res) => {
  const { currentLocation, destination, travelTime, travelDate } = req.body;

  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      {
        currentLocation: currentLocation || undefined,
        destination: destination || undefined,
        travelTime: travelTime || undefined,
        travelDate: travelDate || undefined,
      },
      { new: true }
    );

    if (!updatedItinerary) {
      return res.status(404).json({ status: false, message: 'Itinerary not found.' });
    }

    res.status(200).json({
      status: true,
      message: 'Itinerary updated successfully.',
      data: updatedItinerary,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to update itinerary.',
      error: error.message,
    });
  }
};

// Add a hotel to the itinerary
exports.addHotelToItinerary = async (req, res) => {
  const { name, location, checkInDate, checkOutDate, pricePerNight, totalCost } = req.body;

  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ status: false, message: 'Itinerary not found.' });
    }

    const newHotel = { name, location, checkInDate, checkOutDate, pricePerNight, totalCost };
    itinerary.hotels.push(newHotel);

    await itinerary.save();
    res.status(200).json({
      status: true,
      message: 'Hotel added to itinerary.',
      data: itinerary,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to add hotel.',
      error: error.message,
    });
  }
};

// Add a restaurant to the itinerary
exports.addRestaurantToItinerary = async (req, res) => {
  const { name, location, mealType, averageCost } = req.body;

  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ status: false, message: 'Itinerary not found.' });
    }

    const newRestaurant = { name, location, mealType, averageCost };
    itinerary.restaurants.push(newRestaurant);

    await itinerary.save();
    res.status(200).json({
      status: true,
      message: 'Restaurant added to itinerary.',
      data: itinerary,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to add restaurant.',
      error: error.message,
    });
  }
};

// Add food to the itinerary
exports.addFoodToItinerary = async (req, res) => {
  const { name, type, mealTime, price } = req.body;

  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ status: false, message: 'Itinerary not found.' });
    }

    const newFood = { name, type, mealTime, price };
    itinerary.foods.push(newFood);

    await itinerary.save();
    res.status(200).json({
      status: true,
      message: 'Food added to itinerary.',
      data: itinerary,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to add food.',
      error: error.message,
    });
  }
};

// Add an image to the itinerary
exports.addImageToItinerary = async (req, res) => {
  const { imageId } = req.body;

  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ status: false, message: 'Itinerary not found.' });
    }

    itinerary.images.push(imageId);

    await itinerary.save();
    res.status(200).json({
      status: true,
      message: 'Image added to itinerary.',
      data: itinerary,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to add image.',
      error: error.message,
    });
  }
};

// Get all itineraries for a specific user by username
exports.getUserItineraries = async (req, res) => {
    const { username } = req.params; // Username passed through the URL
  
    try {
      const itineraries = await Itinerary.find({ username });
      if (itineraries.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'No itineraries found for this user.',
        });
      }
  
      res.status(200).json({
        status: true,
        message: 'Itineraries fetched successfully.',
        data: itineraries, // Array of itineraries, each containing an ID
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to fetch itineraries.',
        error: error.message,
      });
    }
  };


  // Update the latitude and longitude of currentLocation and destination using locations from the request body
  exports.updateItineraryLatLong = async (req, res) => {
    const itineraryId = req.params.id;
    const { currentLocation, destination } = req.body;

    // Validate that both locations are provided
    if (!currentLocation || !destination) {
        return res.status(400).json({
            status: false,
            message: 'Both currentLocation and destination must be provided in the request body.',
        });
    }

    try {
        // Function to fetch lat, long, and place_id for a given location using GET
        const fetchLatLongPlaceIds = async (location) => {
            try {
                const response = await axios.get('http://localhost:3000/api/meta/location-details', {
                    params: { query: location } // Send query as a URL parameter
                });

                if (response.data.status && response.data.data.length > 0) {
                    const latLongsAndPlaceIds = {
                        latArray: [],
                        lngArray: [],
                        placeIdArray: []
                    };

                    response.data.data.forEach((place) => {
                        if (place && place.geometry && place.geometry.location) {
                            latLongsAndPlaceIds.latArray.push(place.geometry.location.lat);
                            latLongsAndPlaceIds.lngArray.push(place.geometry.location.lng);
                            latLongsAndPlaceIds.placeIdArray.push(place.place_id || ''); // Push place_id or empty string if not available
                        } else {
                            console.error(`Invalid place data for ${location}`);
                        }
                    });

                    return latLongsAndPlaceIds;
                } else {
                    throw new Error(`No location data found for "${location}".`);
                }
            } catch (error) {
                throw new Error(`Failed to fetch lat/long/place_id for "${location}": ${error.message}`);
            }
        };

        // Fetch lat/long and place_ids for currentLocation and destination
        const currentLocationData = await fetchLatLongPlaceIds(currentLocation);
        const destinationLocationData = await fetchLatLongPlaceIds(destination);

        // Use findByIdAndUpdate to directly update lat/long/place_id arrays
        const updatedItinerary = await Itinerary.findByIdAndUpdate(
            itineraryId,
            {
                $set: {
                    currentLocationLat: currentLocationData.latArray,
                    currentLocationLong: currentLocationData.lngArray,
                    currentLocationPlaceIds: currentLocationData.placeIdArray, // Store place_ids for current location
                    destinationLat: destinationLocationData.latArray,
                    destinationLong: destinationLocationData.lngArray,
                    destinationPlaceIds: destinationLocationData.placeIdArray, // Store place_ids for destination
                }
            },
            { new: true } // Return the updated document
        );

        res.status(200).json({
            status: true,
            message: 'Itinerary latitude, longitude, and place_ids updated successfully.',
            data: updatedItinerary,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Failed to update itinerary latitude, longitude, and place_ids.',
            error: error.message,
        });
    }
};
