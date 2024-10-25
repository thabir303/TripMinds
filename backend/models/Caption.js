const mongoose = require('mongoose');

const CaptionSchema = new mongoose.Schema({
  imageName: { type: String, required: true },
  imageUrl: { type: String, required: true },  // Store the Cloudinary image URL
  caption: { type: String, required: true },
  album: { type: String, required: false },
  embedding: { type: [Number], required: true },  // Embedding field for storing caption embeddings
  dateUploaded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Caption', CaptionSchema);
