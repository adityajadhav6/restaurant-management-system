// server/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Allow the frontend on port 3001 (since your React app is running there now)
app.use(cors({
  origin: 'http://localhost:3005',  // Allow the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow these HTTP methods
  credentials: true,                // Allow credentials (cookies) if needed
}));

app.use(express.json());

// Dummy 12 tables data
let tables = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  status: 'vacant',
  server: null,
  order: [],
}));

// API route to get all tables
app.get('/api/tables', (req, res) => {
  try {
    res.json(tables);  // Return the table data
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Root route (for confirmation)
app.get('/', (req, res) => {
  res.send('✅ Backend is running.');
});

app.listen(PORT, () => {
  console.log(`🔧 Server running on http://localhost:${PORT}`);
});
