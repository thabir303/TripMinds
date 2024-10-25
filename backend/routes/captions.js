const express = require('express');
const Caption = require('../models/Caption');
const router = express.Router();
const cosineSimilarity = require('cosine-similarity');

// Similarity threshold (e.g., only return images with a similarity > 0.25)
const SIMILARITY_THRESHOLD = 0.25;

// Save caption and embedding to MongoDB
router.post('/', async (req, res) => {
  const { imageName, imageUrl, caption, album, embedding } = req.body;

  if (!imageName || !caption || !embedding || !imageUrl) {
    return res.status(400).json({ message: 'Required data is missing' });
  }

  const newCaption = new Caption({ imageName, imageUrl, caption, album, embedding });

  try {
    await newCaption.save();
    res.status(201).json({ message: 'Caption saved successfully!' });
  } catch (err) {
    console.error('Error saving caption:', err);
    res.status(500).json({ message: 'Error saving caption to MongoDB' });
  }
});

// Search captions based on query embedding and filter results based on threshold and distinctness
router.post('/search', async (req, res) => {
  const { query_embedding, query_text } = req.body;

  try {
    const allCaptions = await Caption.find({});

    // Calculate similarity for all captions and filter by threshold and direct match
    const results = allCaptions.map(caption => {
      const similarity = cosineSimilarity(query_embedding, caption.embedding);

      // Check if the query_text exists directly in the caption to prioritize it
      const isDirectMatch = caption.caption.toLowerCase().includes(query_text.toLowerCase());

      return { caption, similarity: isNaN(similarity) ? 0 : similarity, isDirectMatch };
    })
    .filter(result => result.similarity > SIMILARITY_THRESHOLD || result.isDirectMatch)  // Filter by threshold or direct match
    .sort((a, b) => b.similarity - a.similarity);  // Sort by similarity score

    // Filter out duplicates based on imageUrl only
    const distinctResults = [];
    const seenImageUrls = new Set();

    results.forEach(result => {
      if (!seenImageUrls.has(result.caption.imageUrl)) {
        seenImageUrls.add(result.caption.imageUrl);
        distinctResults.push(result);
      }
    });

    res.json(distinctResults.slice(0, 5));  // Return top 10 distinct results
  } catch (err) {
    console.error('Error searching captions:', err);
    res.status(500).json({ message: 'Error searching captions' });
  }
});

module.exports = router;
