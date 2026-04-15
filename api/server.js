const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files
app.use(express.static('public'));
app.use('/tfjs_model', express.static('public/tfjs_model'));

// IMPORTANT: Export instead of listen
module.exports = app;