# SPEC.md

> Living specification for `thokem74/InternetRadio`.
> Update this before coding starts; keep it current as implementation and decisions evolve.

## 1) Problem & Goal
- **Problem statement:** Users need a fast way to discover internet radio stations, filter by metadata, and play streams with favorites support.
- **Target users / stakeholders:** End users (web + terminal users), repository maintainer (`thokem74`).
- **Goal / desired outcome:** Stable full-stack radio app (web + CLI) backed by MongoDB, with reliable browse/filter/play/favorites flows and reproducible dev setup.
- **Out of scope (current):**
  - User accounts/authentication
  - Personalized recommendations
  - Native mobile apps
  - Historical analytics dashboard

## 2) Requirements
### Functional requirements (current implementation)
- [x] List stations from MongoDB with server-side pagination (`GET /api/stations`)
- [x] Filter stations by:
  - [x] name query (`q`)
  - [x] tag (`tag`)
  - [x] country code (`iso_3166_1`)
  - [x] language code (`iso_639`)
- [x] Health endpoint (`GET /api/health`)
- [x] Favorites API:
  - [x] list (`GET /api/favorites`)
  - [x] upsert (`POST /api/favorites`)
  - [x] delete (`DELETE /api/favorites/:stationuuid`)
- [x] Web client (Vue 3): browse, filter, play stream, add/remove favorites
- [x] Terminal CLI (Ink/React): browse, filter, play, toggle favorites, keyboard-driven navigation
- [x] Station catalog seeding from local JSON dataset (`npm run seed:stations`)

### Non-functional requirements (current state)
- **Performance:** Pagination capped at 100 items per request; sorted queries via MongoDB.
- **Reliability:** Input validation on favorites payload (Zod); centralized Express error handler; CI workflow for lint + tests.
- **Security:** `helmet`, `cors`, API rate limiting (`100 req / 15 min` for `/api`), basic payload validation.
- **Observability:** Basic console logs for startup/seeding; no structured logging/metrics yet.
- **Accessibility / UX:** Web UI supports standard controls and clear filter forms; deeper a11y audit pending.

## 3) Constraints & Assumptions
- **Technical constraints:**
  - Node.js 24 runtime (CI uses Node 24)
  - MongoDB required for normal server startup
  - Monorepo npm workspaces: `server`, `client`, `cli`
- **Product constraints:**
  - Catalog data quality depends on source JSON file
  - Stream URLs/homepages/favicons are third-party and may be unreliable
- **Assumptions:**
  - `.env` contains valid `MONGODB_URI`
  - Initial dataset is seeded before meaningful browsing

## 4) Architecture & Design
- **Current architecture summary:**
  - **Server:** Express app with route/controller/store layering and Mongoose models.
  - **Web client:** Vue 3 + Vite + Tailwind frontend consuming `/api` endpoints.
  - **CLI client:** Ink + React terminal UI, direct MongoDB access through shared DB helper logic.

- **Key components/modules:**
  - `server/src/app.js`: middleware + route wiring
  - `server/src/routes/radioRoutes.js`: API route map
  - `server/src/controllers/radioController.js`: request parsing/validation and orchestration
  - `server/src/config/stationStore.js`: station query/filter/pagination logic
  - `server/src/config/favoriteStore.js`: favorites persistence (Mongo + optional memory mode)
  - `server/src/models/*.js`: Mongoose schemas
  - `server/src/seedStations.js`: catalog import/normalization pipeline
  - `client/src/App.vue`: core web UI flow
  - `cli/src/App.jsx`: terminal interaction flow + key bindings

- **Data model / contracts:**
  - Station fields (projected consistently):
    `stationuuid`, `name`, `url_stream`, `url_homepage`, `url_favicon`, `tags`, `iso_3166_1`, `iso_3166_2`, `iso_639`, `geo_lat`, `geo_long`
  - `/api/stations` response:
    - `items: Station[]`
    - `pagination: { page, limit, totalItems, totalPages, hasNextPage, hasPrevPage }`
  - Favorites payload minimum required fields:
    - `stationuuid`, `name`, `url_stream`

- **External dependencies/APIs:**
  - MongoDB
  - Radio station catalog JSON file in repo
  - Client stream playback via browser audio element

## 5) Delivery Plan (small, reviewable steps)
> Break work into small milestones. Each milestone should end in a separate commit.

### Already delivered
1. **Backend API foundation**
   - Scope: Express app, health endpoint, stations endpoint with filters/pagination, favorites CRUD.
   - Tests: server health test.
2. **Web application**
   - Scope: Vue/Tailwind UI for browse/filter/play/favorites.
   - Tests: base Vue mount test.
3. **CLI application**
   - Scope: Ink-based terminal UX with keyboard controls and favorites integration.
4. **Project hardening**
   - Scope: lint setup, Husky + lint-staged, CI workflow, dev container setup.

### Next recommended milestones
1. **Broaden automated tests**
   - Scope: API route tests, store tests, CLI behavior tests, web interaction tests.
   - Tests: unit + integration + component.
   - Commit message: `test: expand coverage for api/web/cli critical flows`
2. **CI quality gates upgrade**
   - Scope: coverage thresholds + optional E2E job.
   - Tests: CI pipeline validation.
   - Commit message: `ci: enforce stronger quality gates and coverage`
3. **Reliability and observability**
   - Scope: structured logging and improved error diagnostics.
   - Tests: integration/system checks for failure paths.
   - Commit message: `feat: improve runtime observability and error handling`

## 6) Test Strategy (quality gates)
- [x] Unit tests (minimal, currently sparse)
- [x] Component tests (client mount smoke test)
- [ ] Integration tests (insufficient coverage of DB + API interactions)
- [ ] System tests
- [ ] E2E tests
- [ ] Acceptance/UAT checks

### Existing automated tests
- `server/src/__tests__/health.test.js` (Supertest + Vitest)
- `client/src/App.test.js` (Vue Test Utils + Vitest)

### Test cases / scenarios to add next
- **Happy paths:** station listing/filter combinations, favorite add/remove/list, playback state transitions.
- **Edge cases:** invalid query params, empty result sets, missing favicon/homepage, duplicate favorite upsert.
- **Failure modes:** DB unavailable, malformed payloads, third-party stream failures, seed file parse failures.

## 7) PR Strategy
- **Branch naming:** `feature/*`, `fix/*`, `chore/*`, `docs/*`
- **PR scope rules:** small, focused, single concern; update `SPEC.md` first when scope/design changes.
- **Merge criteria:** CI green (`lint-and-test`), review completed, no unresolved critical comments.
- **Rollback plan:** revert merge commit; ship hotfix on dedicated `fix/*` branch.

## 8) Risks & Mitigations
| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| External stream URLs are unstable/offline | Playback failures | Validate/skip broken streams in UI, improve fallback messaging | Maintainer |
| Dataset drift or malformed catalog input | Seed/import failures | Keep normalizer strict + add seed validation/reporting | Maintainer |
| Limited automated coverage | Regressions reach main | Expand layered tests + enforce stronger CI gates | Maintainer |
| MongoDB outage/misconfig | API/CLI unavailable | Improve startup diagnostics, document local/devcontainer DB flows | Maintainer |

## 9) Open Questions
- [ ] Should CLI consume API endpoints instead of direct DB access for a single data plane?
- [ ] Should we add authentication/sync for favorites across devices?
- [ ] Do we want curated “featured stations” and preset filter bundles?
- [ ] What coverage thresholds should be required before merging feature PRs?

## 10) Change Log (SPEC updates)
- 2026-02-18: Initial SPEC scaffold added.
- 2026-02-18: Updated SPEC to reflect current implemented architecture, features, quality gates, and next milestones.