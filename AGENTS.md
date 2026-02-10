# Repository Guidelines

## Project Structure & Module Organization
- `client/` contains the Vue 3 + Vite frontend (`src/` for components, composables, and styles).
- `server/` contains the Express + Mongoose API (`src/` with `routes/`, `controllers/`, `models/`, and `config/`).
- `README.md` documents setup and API endpoints.

## Build, Test, and Development Commands
Run these from the repo root unless noted:
- `npm run install:all` installs dependencies for root, `client/`, and `server/` workspaces.
- `npm run dev:server` starts the API with nodemon on `http://localhost:4000`.
- `npm run dev:client` starts the Vite dev server on `http://localhost:5173`.
- `npm run build` builds the client for production.
- `npm run dev --workspace server` same as `dev:server` (useful for one-off workspace commands).
- `npm run lint --workspace server` runs ESLint on the server code.

## Coding Style & Naming Conventions
- JavaScript/TypeScript uses ES modules (`import`/`export`) with two-space indentation.
- Vue single-file components live in `client/src/` and use `<script setup>`.
- Keep filenames descriptive and camelCase for JS modules (e.g., `useRadioApi.js`).
- Prefer functional, small modules in `server/src/` and keep route paths under `/api`.

## Testing Guidelines
- No automated test framework is currently configured.
- If you add tests, document the runner and add scripts to the relevant `package.json`.

## Commit & Pull Request Guidelines
- Git history uses short, imperative, capitalized summaries (e.g., "Add Docker configuration...").
- Keep commits focused; avoid mixing client and server changes unless required.
- PRs should include a clear description, linked issues if applicable, and UI screenshots or screen recordings for frontend changes.

## Configuration Tips
- Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` as needed.
- If MongoDB is unavailable, the API falls back to an in-memory favorites store; note this when debugging persistence issues.
