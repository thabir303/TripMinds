// models/Image.js

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  username: { type: String, required: true, ref: 'User' }, // Reference to the User model by username
  imageUrl: { type: String, required: true },  // URL or path to the image
  imageName: { type: String, required: true }, // Image name
  itinerary: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' }, // Reference to the Itinerary model
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);
