const mongoose = require('mongoose');

// Define the schema for the optional objects (hotels, restaurants, and foods)
const hotelSchema = new mongoose.Schema({
  name: { type: String },
  location: { type: String },
  checkInDate: { type: Date },
  checkOutDate: { type: Date },
  pricePerNight: { type: Number },
  totalCost: { type: Number },
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String },
  location: { type: String },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
  averageCost: { type: Number },
});

const foodSchema = new mongoose.Schema({
  name: { type: String },
  type: { type: String }, // e.g., vegetarian, non-vegetarian, vegan
  mealTime: { type: String }, // breakfast, lunch, or dinner
  price: { type: Number },
});

// Main Itinerary schema
const itinerarySchema = new mongoose.Schema({
  username: { type: String, required: true, ref: 'User' }, // Reference to User model
  currentLocation: { type: String, required: true },
  destination: { type: String, required: true },
  travelTime: { type: String, required: true },
  travelDate: { type: Date, required: true },
  preferences: {
    budget: { type: String, enum: ['budget', 'mid-range', 'luxury'], default: 'budget' },
  },
  // Optional sections (hotels, restaurants, foods, etc.)
  hotels: [hotelSchema], // Array of hotel objects
  restaurants: [restaurantSchema], // Array of restaurant objects
  foods: [foodSchema], // Array of food objects
  estimatedTotalCost: { type: Number }, // Optional total cost of the trip
  transportOptions: { type: String }, // Information about transport options
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }], // Linking images to this itinerary
  createdAt: { type: Date, default: Date.now },
  currentLocationLat: [{ type: Number }], // Array of latitudes for the current location
  currentLocationLong: [{ type: Number }], // Array of longitudes for the current location
  destinationLat: [{ type: Number }], // Array of latitudes for the destination
  destinationLong: [{ type: Number }], // Array of longitudes for the destination
  currentLocationPlaceIds: [{ type: String }], // Array of place_ids for current location
  destinationPlaceIds: [{ type: String }], // Array of place_ids for destination
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
