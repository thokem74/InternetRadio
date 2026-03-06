use walkdir::WalkDir;

pub fn discover_audio_files(root: &str) -> Vec<String> {
    let extensions = ["mp3", "flac", "ogg", "wav", "m4a", "opus", "aac"];
    WalkDir::new(root)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|entry| entry.file_type().is_file())
        .filter_map(|entry| {
            let ext = entry.path().extension()?.to_str()?.to_ascii_lowercase();
            if extensions.contains(&ext.as_str()) {
                Some(entry.path().display().to_string())
            } else {
                None
            }
        })
        .collect()
}
