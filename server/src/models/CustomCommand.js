const mongoose = require('mongoose');

const customCommandSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  trigger: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  actions: [
    {
      type: {
        type: String,
        enum: ['open_url', 'search', 'scroll', 'click', 'navigate', 'read', 'type', 'custom'],
        required: true,
      },
      target: { type: String, default: '' },
      value: { type: String, default: '' },
      delay: { type: Number, default: 0 },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

customCommandSchema.index({ userId: 1 });

module.exports = mongoose.model('CustomCommand', customCommandSchema);
