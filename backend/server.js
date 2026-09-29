import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

import healthRoutes from './routes/health.routes.js';
import errorHandler from './middleware/errorHandler.js';
import prisma from './config/prisma.js';

// ESM has no __dirname built in — this is the standard way to get it back.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const frontendDist = path.resolve(__dirname, '../frontend/dist');

app.use(cors());
app.use(express.json());

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

async function start() {
  try {
    // Fail fast: confirm the DB is reachable before accepting traffic.
    await prisma.$connect();
    console.log('Connected to PostgreSQL via Prisma');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database:', err.message);
    process.exit(1);
  }
}

start();