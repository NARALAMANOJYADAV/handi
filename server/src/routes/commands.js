const express = require('express');
const Command = require('../models/Command');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Save a command
router.post('/', optionalAuth, async (req, res) => {
  try {
    const command = new Command({
      ...req.body,
      userId: req.userId || null,
    });
    await command.save();
    res.status(201).json(command);
  } catch (error) {
    console.error('Save command error:', error);
    res.status(500).json({ message: 'Error saving command' });
  }
});

// Get command history
router.get('/history', optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const query = req.userId ? { userId: req.userId } : {};
    
    const commands = await Command.find(query)
      .sort({ timestamp: -1 })
      .limit(limit);
    
    res.json(commands);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Error fetching command history' });
  }
});

// Clear command history
router.delete('/history', optionalAuth, async (req, res) => {
  try {
    const query = req.userId ? { userId: req.userId } : {};
    await Command.deleteMany(query);
    res.json({ message: 'Command history cleared' });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ message: 'Error clearing history' });
  }
});

// Get command stats
router.get('/stats', optionalAuth, async (req, res) => {
  try {
    const query = req.userId ? { userId: req.userId } : {};
    
    const total = await Command.countDocuments(query);
    const successful = await Command.countDocuments({ ...query, status: 'success' });
    const failed = await Command.countDocuments({ ...query, status: 'failed' });
    
    // Most used commands
    const topCommands = await Command.aggregate([
      { $match: query },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({ total, successful, failed, topCommands });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;
