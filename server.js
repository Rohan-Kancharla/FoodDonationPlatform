const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// API Routes (Mocked or handled on client side)
// These are kept here just in case some other part of the app still tries to call them,
// but they are now effectively no-ops that return success.

app.post('/api/register', (req, res) => {
  res.status(201).json({ success: true, message: 'Registration handled on client side' });
});

app.post('/api/login', (req, res) => {
  res.status(200).json({ success: true, message: 'Login handled on client side' });
});

app.post('/api/donate', (req, res) => {
  res.status(200).json({ success: true, message: 'Donation handled on client side' });
});

// Export for serverless (Vercel) and start locally when executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the website at http://localhost:${PORT}`);
  });
} else {
  module.exports = app;
}