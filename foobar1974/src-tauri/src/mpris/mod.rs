#[derive(Debug, Clone)]
pub struct MprisState {
    pub playback_status: String,
}

impl Default for MprisState {
    fn default() -> Self {
        Self {
            playback_status: "Stopped".to_string(),
        }
    }
}
