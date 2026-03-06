# foobar1974 (Tauri + React + Rust)

A foobar2000-inspired Linux music player scaffold using Tauri with a React TypeScript frontend and a Rust backend.

## Dependencies

- `cvlc` (VLC RC interface)
- `ffmpeg`
- Rust toolchain
- Node.js 20+

## Current MVP scaffold status

- React UI shell with split Library/Queue layout and now-playing bar.
- Virtualized lists powered by `react-virtuoso`.
- Rust modules split for `db`, `library`, `player`, `replaygain`, `mpris`, and `state`.
- SQLite migrations for `tracks`, `replaygain`, and FTS5 `tracks_fts` with sync triggers.
- ReplayGain helper math with clipping-prevention tests.

## Development

```bash
cd foobar1974
npm install
npm run dev
```

Rust checks:

```bash
cd foobar1974/src-tauri
cargo test
```

## Notes

- The data root is intended to be `~/.foobar1974/`.
- This scaffold is prepared for follow-up implementation of VLC RC control, ffmpeg ReplayGain analysis, and MPRIS2 integration.
