# Internet Radio (MEVN)

A full-stack internet radio web app built with **MongoDB, Express, Vue 3, Node.js, and Tailwind CSS**.

## Features
- Browse curated radio stations from different countries.
- Search by station name, country, language, or genre.
- Filter by genre.
- Stream stations in-browser via HTML5 audio.
- Save/remove favorite stations (persisted in MongoDB, with automatic in-memory fallback in dev if MongoDB is unavailable).
- Tailwind-based UI with a dark theme and custom typography.

## Project Structure
- `server/` - Express + Mongoose REST API.
- `client/` - Vue 3 + Vite front-end with Tailwind CSS.

## Getting Started

### 1) Install dependencies
```bash
npm run install:all
```

### 2) Configure environment
```bash
cp server/.env.example server/.env
```

Update `server/.env` if your MongoDB URI differs. If MongoDB is unavailable, the API still runs with an in-memory favorites store.

### 3) Run MongoDB
Use local MongoDB or Docker:

```bash
docker run --name internet-radio-mongo -p 27017:27017 -d mongo:7
```

### 4) Start the API
```bash
npm run dev:server
```

### 5) Start the client
In another terminal:
```bash
npm run dev:client
```

Open `http://localhost:5173`.

## API Endpoints
- `GET /api/health`
- `GET /api/stations`
- `GET /api/favorites`
- `POST /api/favorites`
- `DELETE /api/favorites/:stationId`
