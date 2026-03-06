import { usePlayerStore } from '../context/usePlayerStore';

export function NowPlayingBar() {
  const repeat = usePlayerStore((state) => state.repeat);
  const shuffle = usePlayerStore((state) => state.shuffle);
  const setShuffle = usePlayerStore((state) => state.setShuffle);
  const setRepeat = usePlayerStore((state) => state.setRepeat);

  return (
    <footer className="nowPlaying">
      <div className="meta">
        <div className="art" />
        <div>
          <strong>Nothing playing</strong>
          <p>Ready</p>
        </div>
      </div>
      <div className="controls">
        <button type="button">Prev</button>
        <button type="button">Play/Pause</button>
        <button type="button">Next</button>
        <button type="button">Stop</button>
      </div>
      <div className="toggles">
        <button type="button" onClick={() => setShuffle(!shuffle)}>Shuffle: {shuffle ? 'On' : 'Off'}</button>
        <select value={repeat} onChange={(event) => setRepeat(event.target.value as 'off' | 'all' | 'one')}>
          <option value="off">Repeat Off</option>
          <option value="all">Repeat All</option>
          <option value="one">Repeat One</option>
        </select>
      </div>
    </footer>
  );
}
