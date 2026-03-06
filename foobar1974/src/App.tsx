import { LibraryPane } from './components/LibraryPane';
import { NowPlayingBar } from './components/NowPlayingBar';
import { QueuePane } from './components/QueuePane';
import { usePlayerStore } from './context/usePlayerStore';
import type { Track } from './types/models';

const fakeTracks: Track[] = Array.from({ length: 2000 }, (_, index) => ({
  id: index + 1,
  title: `Track ${index + 1}`,
  artist: `Artist ${index % 120}`,
  album: `Album ${index % 360}`,
  durationMs: 180000
}));

export function App() {
  const setQueue = usePlayerStore((state) => state.setQueue);

  if (usePlayerStore.getState().queue.length === 0) {
    setQueue(fakeTracks.slice(0, 300));
  }

  return (
    <main className="appShell">
      <div className="split">
        <LibraryPane tracks={fakeTracks} />
        <QueuePane />
      </div>
      <NowPlayingBar />
    </main>
  );
}
