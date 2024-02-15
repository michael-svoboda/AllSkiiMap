const express = require('express');
const cors = require('cors'); // Import the cors middleware
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'data' folder
app.use('/data', express.static(path.join(__dirname, 'data')));

// Define a route to serve your GeoJSON file
app.get('/ski-runs', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'ski_runs_alberta.geojson'));
});

// Serve the React app from the 'client/build' folder
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
