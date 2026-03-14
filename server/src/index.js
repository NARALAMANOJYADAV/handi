const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const commandRoutes = require('./routes/commands');
const customCommandRoutes = require('./routes/customCommands');
const settingsRoutes = require('./routes/settings');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/handivoice';

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/custom-commands', customCommandRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 HandiVoice Server running on http://localhost:${PORT}`);
      console.log(`📡 API endpoints:`);
      console.log(`   POST /api/auth/register`);
      console.log(`   POST /api/auth/login`);
      console.log(`   GET  /api/auth/profile`);
      console.log(`   POST /api/commands`);
      console.log(`   GET  /api/commands/history`);
      console.log(`   GET  /api/custom-commands`);
      console.log(`   POST /api/custom-commands`);
      console.log(`   GET  /api/settings`);
      console.log(`   PUT  /api/settings`);
      console.log(`   POST /api/ai/process`);
      console.log(`   GET  /api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.log('💡 Make sure MongoDB is running. The server will start anyway for development.');

    // Start server even without MongoDB (for frontend development)
    app.listen(PORT, () => {
      console.log(`🚀 HandiVoice Server running on http://localhost:${PORT} (no database)`);
    });
  }
}

startServer();
