const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic Route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running normally' });
});

// Import Routes
const authRoutes = require('./routes/auth.routes');
const leadRoutes = require('./routes/lead.routes');
const propertyRoutes = require('./routes/property.routes');

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/properties', propertyRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

module.exports = app;
