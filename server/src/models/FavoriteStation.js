import mongoose from 'mongoose';

const favoriteStationSchema = new mongoose.Schema(
  {
    stationId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    language: {
      type: String,
      required: true,
      trim: true
    },
    genre: {
      type: String,
      required: true,
      trim: true
    },
    streamUrl: {
      type: String,
      required: true,
      trim: true
    },
    homepage: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

export const FavoriteStation = mongoose.model('FavoriteStation', favoriteStationSchema);
