const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 10000;

// Serve everything in the project root as static files
// index.html, style.css, script.js, and /nsfw/model.json all live here
app.use(express.static(path.join(__dirname, '..')));

// Explicit fallback: any unmatched GET → index.html
app.get('(.*)', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});