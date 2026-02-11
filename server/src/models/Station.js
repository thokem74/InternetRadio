import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema(
  {
    stationuuid: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    url_stream: {
      type: String,
      required: true,
      trim: true
    },
    url_homepage: {
      type: String,
      default: '',
      trim: true
    },
    url_favicon: {
      type: String,
      default: '',
      trim: true
    },
    tags: {
      type: String,
      default: '',
      trim: true
    },
    iso_3166_1: {
      type: String,
      default: '',
      trim: true
    },
    iso_3166_2: {
      type: String,
      default: null,
      trim: true
    },
    iso_639: {
      type: String,
      default: null,
      trim: true
    },
    geo_lat: {
      type: Number,
      default: null
    },
    geo_long: {
      type: Number,
      default: null
    }
  },
  { timestamps: true }
);

export const Station = mongoose.model('Station', stationSchema);
