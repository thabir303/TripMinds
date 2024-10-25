// controllers/imageController.js
const cloudinary = require('../config/cloudinaryConfig');
const Image = require('../models/Image');

const imageController = {
  // Upload image
  uploadImage: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: false,
          message: 'No image file provided'
        });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'trip_images',
        resource_type: 'auto'
      });

      // Create new image document
      const newImage = new Image({
        url: result.secure_url,
        cloudinaryId: result.public_id,
        tripId: req.body.tripId || null,
        album: req.body.album || null,
        caption: req.body.caption || '',
        tags: req.body.tags ? JSON.parse(req.body.tags) : []
      });

      await newImage.save();

      res.status(201).json({
        status: true,
        message: 'Image uploaded successfully',
        data: newImage
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        status: false,
        message: 'Failed to upload image',
        error: error.message
      });
    }
  },

  // Get all images
  getAllImages: async (req, res) => {
    try {
      const images = await Image.find().sort({ createdAt: -1 });
      res.status(200).json({
        status: true,
        data: images
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to fetch images',
        error: error.message
      });
    }
  },

  // Get trip images
  getTripImages: async (req, res) => {
    try {
      const { tripId } = req.params;
      const images = await Image.find({ tripId }).sort({ createdAt: -1 });
      res.status(200).json({
        status: true,
        data: images
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to fetch trip images',
        error: error.message
      });
    }
  },

  // Search images
  searchImages: async (req, res) => {
    try {
      const { query, tripId } = req.query;
      let searchCondition = {};

      if (tripId) {
        searchCondition.tripId = tripId;
      }

      if (query) {
        searchCondition.$or = [
          { caption: { $regex: query, $options: 'i' } },
          { tags: { $elemMatch: { $regex: query, $options: 'i' } } }
        ];
      }

      const images = await Image.find(searchCondition).sort({ createdAt: -1 });
      res.status(200).json({
        status: true,
        data: images
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to search images',
        error: error.message
      });
    }
  },

  // Delete image
  deleteImage: async (req, res) => {
    try {
      const { id } = req.params;
      const image = await Image.findById(id);

      if (!image) {
        return res.status(404).json({
          status: false,
          message: 'Image not found'
        });
      }

      // Delete from Cloudinary
      await cloudinary.uploader.destroy(image.cloudinaryId);

      // Delete from database
      await Image.findByIdAndDelete(id);

      res.status(200).json({
        status: true,
        message: 'Image deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to delete image',
        error: error.message
      });
    }
  }
};

module.exports = imageController;