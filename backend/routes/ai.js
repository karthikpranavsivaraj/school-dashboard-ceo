const express = require('express');
const router = express.Router();
const { generateAIInsights } = require('../services/aiService');
const { protect } = require('../middleware/authMiddleware');

router.post('/insights', protect, async (req, res) => {
    try {
        const { role, stats } = req.body;
        
        if (!role || !stats) {
            return res.status(400).json({ message: 'Role and stats payload are required.' });
        }

        const data = await generateAIInsights(role, stats);
        // Sending the JSON object { insights: [...] } back to the client
        res.json(data);
    } catch (error) {
        console.error('Error generating AI Insights:', error);
        res.status(500).json({ message: 'Failed to generate AI Insights.', error: error.message });
    }
});

module.exports = router;
