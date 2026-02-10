import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setMemoryStoreMode } from './config/favoriteStore.js';
import radioRoutes from './routes/radioRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = Number(process.env.PORT) || 4000;
const mongoUri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', radioRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

async function start() {
  if (!mongoUri) {
    console.warn('Missing MONGODB_URI, using in-memory favorites store.');
    setMemoryStoreMode(true);
  } else {
    try {
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB.');
    } catch (error) {
      console.warn('MongoDB connection failed, using in-memory favorites store.', error.message);
      setMemoryStoreMode(true);
    }
  }

  app.listen(port, () => {
    console.log(`Internet Radio API listening at http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
