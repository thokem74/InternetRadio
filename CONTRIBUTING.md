# Contributing

## Setup

1. Install Node.js 24+ and npm.
2. Install dependencies from the repo root:
   ```bash
   npm run install:all
   ```
3. Configure backend environment:
   ```bash
   cp server/.env.example server/.env
   ```
4. Set `MONGODB_URI` in `server/.env`.
5. Start the app:
   ```bash
   npm run dev:server
   npm run dev:client
   ```

## Development Commands

- Root lint:
  ```bash
  npm run lint
  ```
- Client tests:
  ```bash
  npm run test --workspace client
  ```
- Server tests:
  ```bash
  npm run test --workspace server
  ```
- Seed stations:
  ```bash
  npm run seed:stations
  ```

## Coding Standards

- Use ES modules (`import`/`export`) throughout the project.
- Use two-space indentation.
- Keep modules small and focused.
- Vue components use `<script setup>` and live in `client/src`.
- Keep API routes under `/api` in `server/src/routes`.
- Run linting before committing.
- Pre-commit checks use Husky + lint-staged.

## Pull Requests

1. Keep changes scoped to a single concern.
2. Use conventional commit messages.
3. Include a clear summary and testing notes.
4. Link related issues when applicable.
5. Include screenshots/videos for UI changes.
6. Ensure CI passes (lint + tests).
