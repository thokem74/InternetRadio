#[derive(Debug, Clone, Copy)]
pub struct ReplayGainSettings {
    pub preamp_db: f32,
    pub prevent_clipping: bool,
}

pub fn db_to_linear(db: f32) -> f32 {
    10_f32.powf(db / 20.0)
}

pub fn linear_to_db(linear: f32) -> f32 {
    20.0 * linear.log10()
}

pub fn effective_gain_db(track_gain_db: f32, peak: f32, settings: ReplayGainSettings) -> f32 {
    let desired = track_gain_db + settings.preamp_db;
    if settings.prevent_clipping {
        let linear = db_to_linear(desired);
        let max_peak = peak * linear;
        if max_peak > 1.0 {
            return desired - linear_to_db(max_peak);
        }
    }
    desired
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn converts_db_to_linear() {
        assert!((db_to_linear(6.0) - 1.995).abs() < 0.01);
    }

    #[test]
    fn clipping_prevention_reduces_gain() {
        let gain = effective_gain_db(
            5.0,
            0.95,
            ReplayGainSettings {
                preamp_db: 4.0,
                prevent_clipping: true,
            },
        );
        assert!(gain < 9.0);
    }
}
