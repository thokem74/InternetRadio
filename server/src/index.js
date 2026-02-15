import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = createApp();
const port = Number(process.env.PORT) || 4000;
const mongoUri = process.env.MONGODB_URI;

async function start() {
  if (!mongoUri) {
    throw new Error('Missing MONGODB_URI. MongoDB is required to start the server.');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }

  app.listen(port, () => {
    console.log(`Internet Radio API listening at http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
