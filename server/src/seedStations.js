import dotenv from 'dotenv';
import fs from 'node:fs';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeStation } from './config/stationNormalizer.js';
import { Station } from './models/Station.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
const catalogPath = path.resolve(__dirname, '../../radiobrowser_stations_latest.json');

dotenv.config({ path: envPath });

function loadCatalog() {
  if (!fs.existsSync(catalogPath)) {
    throw new Error(`Station catalog not found at ${catalogPath}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to parse station catalog JSON: ${error.message}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Station catalog format is invalid. Expected a JSON array.');
  }

  return parsed;
}

async function seedStations() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('Missing MONGODB_URI. Cannot seed stations without MongoDB.');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB.');

  const rawCatalog = loadCatalog();
  const normalizedStations = rawCatalog
    .map((item) => normalizeStation(item))
    .filter((station) => station.stationuuid && station.name && station.url_stream);

  if (normalizedStations.length === 0) {
    throw new Error('No valid stations found in catalog after normalization.');
  }

  await Station.deleteMany({});
  const inserted = await Station.insertMany(normalizedStations, { ordered: true });

  console.log(`Raw stations read: ${rawCatalog.length}`);
  console.log(`Valid stations normalized: ${normalizedStations.length}`);
  console.log(`Stations inserted: ${inserted.length}`);
}

seedStations()
  .then(() => {
    console.log('Station seeding completed.');
  })
  .catch((error) => {
    console.error('Station seeding failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error('Failed to disconnect MongoDB cleanly:', error.message);
    }
  });
