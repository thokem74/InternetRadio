import { Virtuoso } from 'react-virtuoso';
import { usePlayerStore } from '../context/usePlayerStore';

export function QueuePane() {
  const queue = usePlayerStore((state) => state.queue);

  return (
    <section className="pane">
      <h2>Queue</h2>
      <div className="listWrap">
        <Virtuoso
          data={queue}
          itemContent={(index, track) => (
            <div className="row queueRow">
              <span>{index + 1}.</span>
              <div>
                <strong>{track.title}</strong>
                <span>{track.artist}</span>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  );
}
