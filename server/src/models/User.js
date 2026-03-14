const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  preferredLanguage: {
    type: String,
    enum: ['en-US', 'hi-IN', 'te-IN'],
    default: 'en-US',
  },
  accessibilitySettings: {
    darkMode: { type: Boolean, default: true },
    highContrast: { type: Boolean, default: false },
    largeText: { type: Boolean, default: false },
    voiceFeedback: { type: Boolean, default: true },
    focusMode: { type: Boolean, default: false },
    autoRead: { type: Boolean, default: false },
    speechRate: { type: Number, default: 1, min: 0.5, max: 2 },
    speechVolume: { type: Number, default: 1, min: 0, max: 1 },
  },
  emergencyContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    relationship: { type: String, default: '' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
