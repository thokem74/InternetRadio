# Internet Radio (MEVN)

A full-stack internet radio web app built with **MongoDB, Express, Vue 3, Node.js, and Tailwind CSS**.

## Features
- Browse a large station catalog stored in MongoDB (seeded from `radiobrowser_stations_latest.json`).
- Server-side pagination with search and ISO/tag filters.
- Stream stations in-browser via HTML5 audio.
- Save/remove favorite stations persisted in MongoDB.
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

Update `server/.env` if your MongoDB URI differs. MongoDB is required for server startup.

### 3) Run MongoDB
Use local MongoDB or Docker:

```bash
docker run --name internet-radio-mongo -p 27017:27017 -d mongo:7
```

### 4) Seed stations into MongoDB
```bash
npm run seed:stations --workspace server
```

The seed process replaces all existing station documents with data from `radiobrowser_stations_latest.json`.

### 5) Start the API
```bash
npm run dev:server
```

### 6) Start the client
In another terminal:
```bash
npm run dev:client
```

Open `http://localhost:5173`.

## API Endpoints
- `GET /api/health`
- `GET /api/stations`
  - Query params:
    - `page` (default `1`)
    - `limit` (default `50`, max `100`)
    - `q` (searches `name`, `tags`, `iso_3166_1`, `iso_639`)
    - `tag` (exact tag match against comma-separated `tags`)
    - `iso_3166_1`
    - `iso_639`
  - Response:
    - `items`: station array using schema `{ stationuuid, name, url_stream, url_homepage, url_favicon, tags, iso_3166_1, iso_3166_2, iso_639, geo_lat, geo_long }`
    - `pagination`: `{ page, limit, totalItems, totalPages, hasNextPage, hasPrevPage }`
- `GET /api/favorites`
- `POST /api/favorites`
  - Payload uses the same station schema keys as above.
- `DELETE /api/favorites/:stationuuid`
