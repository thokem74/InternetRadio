import { Virtuoso } from 'react-virtuoso';
import type { Track } from '../types/models';

interface LibraryPaneProps {
  tracks: Track[];
}

export function LibraryPane({ tracks }: LibraryPaneProps) {
  return (
    <section className="pane">
      <h2>Library</h2>
      <input className="search" placeholder="Search tracks..." />
      <div className="listWrap">
        <Virtuoso
          data={tracks}
          itemContent={(_, track) => (
            <button className="row" type="button">
              <strong>{track.title}</strong>
              <span>{track.artist} · {track.album}</span>
            </button>
          )}
        />
      </div>
    </section>
  );
}
