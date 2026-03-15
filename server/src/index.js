const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const path = require('path');

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

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.log('💡 Make sure MongoDB is running.');
  });

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve(__dirname, '../../client/dist');
  console.log(`📂 Serving static files from: ${clientBuildPath}`);
  
  app.use(express.static(clientBuildPath));
  
  // Catch-all route to serve the React index.html
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      const indexPath = path.resolve(clientBuildPath, 'index.html');
      console.log(`📄 Fallback: Sending index.html to ${req.url}`);
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});


const server = app.listen(PORT, () => {
  console.log(`🚀 HandiVoice Server running on http://localhost:${PORT}`);
});
