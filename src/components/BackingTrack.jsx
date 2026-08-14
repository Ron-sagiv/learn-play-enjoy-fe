import { useRef, useState } from 'react';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

const BackingTrack = ({ song }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loop, setLoop] = useState(false);

  if (!song.backingTrackUrl) return null;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.paused ? audio.play() : audio.pause();
  };

  const seek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrent(time);
  };

  return (
    <section className="mt-8">
      <h2 className="font-serif text-accent mb-4 text-xl font-semibold sm:text-2xl">
        Backing track
      </h2>

      <div className="bg-base-200 border-base-300 rounded-box border p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            aria-label={playing ? 'Pause backing track' : 'Play backing track'}
            className="bg-accent text-accent-content flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            {playing ? '❚❚' : '▶'}
          </button>

          <div className="min-w-0 flex-1">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={current}
              onChange={seek}
              aria-label="Seek"
              className="range range-xs range-accent w-full"
            />
            <div className="text-neutral mt-1 flex justify-between text-xs tabular-nums">
              <span>{formatTime(current)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <button
            onClick={() => setLoop((v) => !v)}
            aria-pressed={loop}
            aria-label="Loop track"
            className={`btn btn-circle btn-sm shrink-0 ${
              loop ? 'btn-secondary' : 'btn-ghost text-neutral'
            }`}
          >
            ↻
          </button>
        </div>

        <audio
          ref={audioRef}
          src={song.backingTrackUrl}
          loop={loop}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setCurrent(e.target.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
        />
      </div>
    </section>
  );
};

export default BackingTrack;
