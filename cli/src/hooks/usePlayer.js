import { spawn } from 'node:child_process';
import { useCallback, useEffect, useRef, useState } from 'react';

export const usePlayer = () => {
  const processRef = useRef(null);
  const stopRequestedRef = useRef(false);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState('');

  const stop = useCallback(() => {
    stopRequestedRef.current = true;
    if (processRef.current) {
      processRef.current.kill('SIGTERM');
      processRef.current = null;
    }

    setIsPaused(false);
    setNowPlaying(null);
  }, []);

  const play = useCallback((station) => {
    if (!station?.url_stream) {
      setError('Station does not have a stream URL');
      return false;
    }

    stopRequestedRef.current = true;
    if (processRef.current) {
      processRef.current.kill('SIGTERM');
      processRef.current = null;
    }

    stopRequestedRef.current = false;
    setError('');
    setIsPaused(false);
    setNowPlaying(station);

    const child = spawn('cvlc', ['--intf', 'dummy', '--play-and-exit', station.url_stream], {
      stdio: ['ignore', 'ignore', 'pipe']
    });

    child.stderr.on('data', (data) => {
      const message = data.toString().trim();
      if (message.toLowerCase().includes('error')) {
        setError(message);
      }
    });

    child.on('error', (spawnError) => {
      setError(spawnError.message);
      setNowPlaying(null);
      setIsPaused(false);
      processRef.current = null;
    });

    child.on('close', () => {
      processRef.current = null;
      setIsPaused(false);

      if (!stopRequestedRef.current) {
        setNowPlaying(null);
      }
    });

    processRef.current = child;
    return true;
  }, []);

  const togglePause = useCallback(() => {
    const playerProcess = processRef.current;
    if (!playerProcess) {
      return;
    }

    if (isPaused) {
      playerProcess.kill('SIGCONT');
      setIsPaused(false);
      return;
    }

    playerProcess.kill('SIGSTOP');
    setIsPaused(true);
  }, [isPaused]);

  useEffect(() => stop, [stop]);

  return {
    nowPlaying,
    isPaused,
    error,
    play,
    stop,
    togglePause,
    isPlaying: Boolean(processRef.current)
  };
};
