use rusqlite::Connection;

pub const MIGRATION_SQL: &str = r#"
CREATE TABLE IF NOT EXISTS tracks (
  id INTEGER PRIMARY KEY,
  path TEXT UNIQUE NOT NULL,
  title TEXT,
  artist TEXT,
  album TEXT,
  album_artist TEXT,
  duration_ms INTEGER,
  track_no INTEGER,
  disc_no INTEGER,
  year INTEGER,
  genre TEXT,
  file_mtime INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS replaygain (
  track_id INTEGER PRIMARY KEY REFERENCES tracks(id) ON DELETE CASCADE,
  track_gain_db REAL,
  track_peak REAL,
  album_gain_db REAL,
  album_peak REAL,
  analyzed_at INTEGER
);

CREATE VIRTUAL TABLE IF NOT EXISTS tracks_fts USING fts5(title, artist, album, path, content='tracks', content_rowid='id');

CREATE TRIGGER IF NOT EXISTS tracks_ai AFTER INSERT ON tracks BEGIN
  INSERT INTO tracks_fts(rowid, title, artist, album, path)
  VALUES (new.id, new.title, new.artist, new.album, new.path);
END;

CREATE TRIGGER IF NOT EXISTS tracks_ad AFTER DELETE ON tracks BEGIN
  INSERT INTO tracks_fts(tracks_fts, rowid, title, artist, album, path)
  VALUES ('delete', old.id, old.title, old.artist, old.album, old.path);
END;

CREATE TRIGGER IF NOT EXISTS tracks_au AFTER UPDATE ON tracks BEGIN
  INSERT INTO tracks_fts(tracks_fts, rowid, title, artist, album, path)
  VALUES ('delete', old.id, old.title, old.artist, old.album, old.path);
  INSERT INTO tracks_fts(rowid, title, artist, album, path)
  VALUES (new.id, new.title, new.artist, new.album, new.path);
END;
"#;

pub fn init_db(path: &str) -> rusqlite::Result<Connection> {
    let conn = Connection::open(path)?;
    conn.execute_batch(MIGRATION_SQL)?;
    Ok(conn)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn applies_migrations() {
        let conn = Connection::open_in_memory().expect("in memory db");
        conn.execute_batch(MIGRATION_SQL).expect("migrations");
        let count: i64 = conn
            .query_row(
                "SELECT count(*) FROM sqlite_master WHERE type='table' AND name IN ('tracks', 'replaygain')",
                [],
                |row| row.get(0),
            )
            .expect("count");
        assert_eq!(count, 2);
    }
}
