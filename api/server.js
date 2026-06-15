const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 10000;

// Serve static files from project root
// Handles: index.html, style.css, script.js, /nsfw/model.json
app.use(express.static(path.join(__dirname, '..')));

// Fallback — no app.get() wildcard, uses middleware instead
// Works with Express 4 AND Express 5 / path-to-regexp v8
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});