const express = require('express');
const CustomCommand = require('../models/CustomCommand');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all custom commands for user
router.get('/', auth, async (req, res) => {
  try {
    const commands = await CustomCommand.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(commands);
  } catch (error) {
    console.error('Get custom commands error:', error);
    res.status(500).json({ message: 'Error fetching custom commands' });
  }
});

// Create custom command
router.post('/', auth, async (req, res) => {
  try {
    const command = new CustomCommand({
      ...req.body,
      userId: req.userId,
    });
    await command.save();
    res.status(201).json(command);
  } catch (error) {
    console.error('Create custom command error:', error);
    res.status(500).json({ message: 'Error creating custom command' });
  }
});

// Update custom command
router.put('/:id', auth, async (req, res) => {
  try {
    const command = await CustomCommand.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!command) {
      return res.status(404).json({ message: 'Custom command not found' });
    }
    res.json(command);
  } catch (error) {
    console.error('Update custom command error:', error);
    res.status(500).json({ message: 'Error updating custom command' });
  }
});

// Delete custom command
router.delete('/:id', auth, async (req, res) => {
  try {
    const command = await CustomCommand.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!command) {
      return res.status(404).json({ message: 'Custom command not found' });
    }
    res.json({ message: 'Custom command deleted' });
  } catch (error) {
    console.error('Delete custom command error:', error);
    res.status(500).json({ message: 'Error deleting custom command' });
  }
});

module.exports = router;
