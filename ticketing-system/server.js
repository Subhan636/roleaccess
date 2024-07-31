const express = require('express');
const path = require('path');
const app = express();
const port = 3000; // or any other port you prefer

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to serve the roles.html
app.get('/roles', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'roles.html'));
});

// Route to serve the overview.html
app.get('/overview', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'overview.html'));
});

// Route to serve the review.html
app.get('/review', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'review.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
