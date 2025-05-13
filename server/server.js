// server/server.js
require('dotenv').config(); // Load .env first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tableRoutes = require('./routes/tableRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: 'http://localhost:3005',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/tables', tableRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('✅ Backend is running and connected to MongoDB.');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

