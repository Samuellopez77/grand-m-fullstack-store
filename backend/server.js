/* ===== the address of this server connected to the network is
 URL-> http://localhost:3000
 IP-> localhost:3000 ===== */
require('dotenv').config();

const path = require('path');
const express = require('express');

const connectDB = require('./config/db');
const healthRoutes = require('./routes/health.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const frontendDist = path.resolve(__dirname, '../frontend/dist');

app.use(express.json());

// Connect to the database before we start accepting traffic that needs it.
connectDB();

// ----- API routes -----
app.use('/api/health', healthRoutes);

// Anything under /api that isn't matched above is a real 404 (JSON, not the SPA index.html).
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ----- Frontend (SPA) -----
app.use(express.static(frontendDist));
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Centralized error handler — must be registered last.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
