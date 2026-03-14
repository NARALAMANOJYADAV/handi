const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  text: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  params: {
    target: { type: String, default: '' },
    value: { type: String, default: '' },
  },
  language: {
    type: String,
    default: 'en-US',
  },
  confidence: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success',
  },
  response: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient querying
commandSchema.index({ userId: 1, timestamp: -1 });
commandSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Command', commandSchema);
