use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq)]
pub enum RepeatMode {
    Off,
    All,
    One,
}

#[derive(Debug, Default)]
pub struct QueueModel {
    pub current_index: Option<usize>,
    pub items: Vec<i64>,
    pub shuffle: bool,
    pub repeat: Option<RepeatMode>,
}

impl QueueModel {
    pub fn enqueue_and_play(&mut self, track_id: i64) {
        self.items.push(track_id);
        self.current_index = Some(self.items.len() - 1);
    }
}
