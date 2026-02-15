import path from 'node:path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
}

const DEFAULT_URI = 'mongodb://localhost:27017/internet-radio';
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_URI;

export const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(MONGODB_URI);
  return mongoose.connection;
};

export const disconnectDb = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

export { MONGODB_URI };
