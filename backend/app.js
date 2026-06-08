const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const customerRoutes = require('./routes/customerRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const promotionVehicleRoutes = require('./routes/promotionVehicleRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');

const { requireAuth } = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'pms_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', requireAuth, vehicleRoutes);
app.use('/api/customers', requireAuth, customerRoutes);
app.use('/api/promotions', requireAuth, promotionRoutes);
app.use('/api/promotion-vehicles', requireAuth, promotionVehicleRoutes);
app.use('/api/dashboard', requireAuth, dashboardRoutes);
app.use('/api/reports', requireAuth, reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PMS API is running' });
});

module.exports = app;
