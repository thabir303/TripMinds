// services/imageService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const imageService = {
  // Get all images or trip-specific images
  getImages: async (tripId = null) => {
    try {
      const endpoint = tripId 
        ? `${BASE_URL}/images/trip/${tripId}`
        : `${BASE_URL}/images`;
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch images');
    }
  },

  // Upload image
  uploadImage: async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  },

  // Search images
  searchImages: async (query, tripId = null) => {
    try {
      const params = { query };
      if (tripId) params.tripId = tripId;
      
      const response = await axios.get(`${BASE_URL}/images/search`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search images');
    }
  }
};