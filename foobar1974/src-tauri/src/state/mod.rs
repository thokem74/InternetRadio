use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct AppState {
    pub library_folders: Vec<String>,
    pub volume: u8,
    pub shuffle: bool,
    pub repeat_mode: String,
}
