# Internet Radio (MEVN)

Full-stack internet radio app built with **MongoDB, Express, Vue 3, Node.js, and Tailwind CSS**.

## Features
- Browse stations from MongoDB with server-side pagination.
- Filter by station-name search (`q`), tag, `iso_3166_1`, and `iso_639`.
- Play streams in-browser with an HTML5 audio player.
- "Now playing" panel shows station image, name, ISO codes, tags, and homepage link.
- Station cards show neon tag badges, ISO codes, homepage link, and favorite controls.
- Save and remove favorites via API.

## Project Structure
- `client/`: Vue 3 + Vite + Tailwind app.
- `server/`: Express + Mongoose API.
- `radiobrowser_stations_latest.json`: source data for seeding station catalog.

## Scripts
Run from repo root:

- `npm run install:all` installs root + workspace dependencies.
- `npm run dev:server` starts API (`http://localhost:4000`).
- `npm run dev:client` starts Vite client (`http://localhost:5173`).
- `npm run build` builds client production bundle.
- `npm run seed:stations` seeds stations (delegates to server workspace script).

Server workspace:

- `npm run dev --workspace server`
- `npm run lint --workspace server`
- `npm run seed:stations --workspace server`

## Getting Started

### 1) Install dependencies
```bash
npm run install:all
```

### 2) Configure environment
```bash
cp server/.env.example server/.env
```

Set `MONGODB_URI` in `server/.env`. MongoDB is required for API startup and seeding.

### 3) Start MongoDB (example with Docker)
```bash
docker run --name internet-radio-mongo -p 27017:27017 -d mongo:7
```

### 4) Seed station catalog
```bash
npm run seed:stations
```

This replaces existing station documents using normalized data from `radiobrowser_stations_latest.json`.

### 5) Run server and client
Terminal 1:
```bash
npm run dev:server
```

Terminal 2:
```bash
npm run dev:client
```

Open `http://localhost:5173`.

## API

### `GET /api/health`
- Returns `{ status: 'ok' }`.

### `GET /api/stations`
Query parameters:
- `page`: default `1`
- `limit`: default `50`, max `100`
- `q`: case-insensitive match on `name`
- `tag`: exact tag match within comma-separated `tags`
- `iso_3166_1`: case-insensitive country code match
- `iso_639`: case-insensitive language code match

Response shape:
- `items`: station array with fields:
  - `stationuuid`, `name`, `url_stream`, `url_homepage`, `url_favicon`
  - `tags`, `iso_3166_1`, `iso_3166_2`, `iso_639`, `geo_lat`, `geo_long`
- `pagination`: `page`, `limit`, `totalItems`, `totalPages`, `hasNextPage`, `hasPrevPage`

### `GET /api/favorites`
- Returns favorites array in the same station/favorite shape.

### `POST /api/favorites`
- Upserts a favorite by `stationuuid`.
- Required fields: `stationuuid`, `name`, `url_stream`.

### `DELETE /api/favorites/:stationuuid`
- Deletes favorite by station UUID.

## Notes
- Client dev server proxies `/api` requests to `http://localhost:4000` (`client/vite.config.js`).
- Station seeding normalizes records (name trimming/shortening, deduped tags, numeric coordinates).
