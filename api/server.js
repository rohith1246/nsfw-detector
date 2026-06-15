const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 10000;

// Static files live in /public/ (index.html, style.css, script.js, /nsfw/)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback → index.html (no wildcard route, Express 4+5 safe)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});