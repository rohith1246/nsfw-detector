const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Important: Serve static files FIRST
app.use(express.static(path.join(__dirname, '../public')));

// Routes for clean URLs
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/about.html'));
});

// Optional: Also support /about.html directly
app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/about.html'));
});

// Fallback - send index.html for any unknown route (helps with refresh on /about)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Export the app (VERY IMPORTANT for Vercel)
module.exports = app;