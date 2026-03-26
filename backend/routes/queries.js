const express = require('express');
const Query = require('../models/Query');
const { protect } = require('../middleware/authMiddleware');
const { rbac } = require('../middleware/rbac');
const router = express.Router();

// GET all queries (Protected)
router.get('/', protect, async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET query by ID (Protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) return res.status(404).json({ message: 'Query not found' });
    res.json(query);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function for simple sentiment analysis
const calculateSentiment = (text) => {
  const negativeWords = ['bad', 'error', 'issue', 'problem', 'fail', 'concern', 'disappointed', 'late', 'rude', 'missing', 'broke', 'broken', 'poor', 'worst', 'unhappy', 'not good'];
  const positiveWords = ['great', 'good', 'excellent', 'happy', 'thanks', 'thank you', 'amazing', 'perfect', 'love', 'best', 'satisfied', 'wonderful', 'appreciate'];

  const lowerText = text.toLowerCase();
  let score = 0;

  negativeWords.forEach(word => { if (lowerText.includes(word)) score--; });
  positiveWords.forEach(word => { if (lowerText.includes(word)) score++; });

  if (score < 0) return 'Concerned';
  if (score > 0) return 'Positive';
  return 'Neutral';
};

// POST new query
router.post('/', async (req, res) => {
  try {
    const { subject, message } = req.body;
    const sentiment = calculateSentiment(`${subject} ${message}`);

    const query = new Query({
      ...req.body,
      sentiment
    });
    await query.save();

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.emit('newQuery', query);
    }

    res.status(201).json(query);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT update query (Protected)
router.put('/:id', protect, rbac(['ceo', 'admin']), async (req, res) => {
  try {
    const existingQuery = await Query.findById(req.params.id);
    if (!existingQuery) return res.status(404).json({ message: 'Query not found' });

    let updateData = { ...req.body };

    // SLA Tracking Logic
    if (req.body.status === 'Resolved' && existingQuery.status !== 'Resolved') {
      updateData.resolvedAt = new Date();
      const createdTime = new Date(existingQuery.createdAt).getTime();
      const resolvedTime = updateData.resolvedAt.getTime();
      // Calculate hours difference
      updateData.slaDurationHours = Math.round((resolvedTime - createdTime) / (1000 * 60 * 60));
    }

    const query = await Query.findByIdAndUpdate(req.params.id, updateData, { new: true });


    // Emit real-time update event
    const io = req.app.get('io');
    if (io) {
      io.emit('updateQuery', query);
    }

    res.json(query);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE query (Protected)
router.delete('/:id', protect, rbac(['ceo', 'admin']), async (req, res) => {
  try {
    const query = await Query.findByIdAndDelete(req.params.id);
    if (!query) return res.status(404).json({ message: 'Query not found' });
    res.json({ message: 'Query deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;