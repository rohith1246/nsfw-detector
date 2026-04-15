const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve all static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Explicit routes for HTML pages (important for Vercel & clean URLs)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/about.html'));
});

app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/about.html'));
});

// Fallback for any other routes (optional but recommended)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Export for Vercel serverless
module.exports = app;