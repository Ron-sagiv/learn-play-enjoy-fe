import { useEffect, useRef, useState } from 'react';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

/* Accepts watch?v=, youtu.be/, /embed/, /shorts/ or a bare 11-char id. */
const getVideoId = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null;
    const v = u.searchParams.get('v');
    if (v) return v;
    const parts = u.pathname.split('/').filter(Boolean);
    const i = parts.findIndex((p) => p === 'embed' || p === 'shorts');
    return i !== -1 ? (parts[i + 1] ?? null) : null;
  } catch {
    return /^[\w-]{11}$/.test(url) ? url : null;
  }
};

/* Load the IFrame API once per page, no matter how many players mount. */
let apiPromise = null;
const loadYouTubeApi = () => {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
  });
  return apiPromise;
};

const BackingTrack = ({ song }) => {
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const loopRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loop, setLoop] = useState(false);

  const videoId = getVideoId(song.backingTrackUrl);

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  useEffect(() => {
    if (!videoId) return;
    let cancelled = false;

    // The API replaces the node it's given, so hand it a throwaway child
    // instead of a node React owns.
    const mount = document.createElement('div');
    hostRef.current.appendChild(mount);

    loadYouTubeApi().then((YT) => {
      if (cancelled) return;
      playerRef.current = new YT.Player(mount, {
        videoId,
        playerVars: { controls: 0, disablekb: 1, playsinline: 1, rel: 0 },
        events: {
          onReady: (e) => {
            setDuration(e.target.getDuration());
            setReady(true);
          },
          onStateChange: (e) => {
            setPlaying(e.data === YT.PlayerState.PLAYING);
            if (e.data === YT.PlayerState.PLAYING) {
              setDuration(e.target.getDuration());
            }
            if (e.data === YT.PlayerState.ENDED) {
              if (loopRef.current) {
                e.target.seekTo(0, true);
                e.target.playVideo();
              } else {
                setCurrent(0);
              }
            }
          },
        },
      });
    });

    const ticker = setInterval(() => {
      const player = playerRef.current;
      if (player?.getCurrentTime) setCurrent(player.getCurrentTime());
    }, 250);

    return () => {
      cancelled = true;
      clearInterval(ticker);
      playerRef.current?.destroy?.();
      playerRef.current = null;
      if (hostRef.current) hostRef.current.innerHTML = '';
      setReady(false);
      setPlaying(false);
      setCurrent(0);
      setDuration(0);
    };
  }, [videoId]);

  if (!videoId) return null;

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;
    playing ? player.pauseVideo() : player.playVideo();
  };

  const seek = (e) => {
    const time = Number(e.target.value);
    setCurrent(time);
    playerRef.current?.seekTo(time, true);
  };

  return (
    <section className="relative mt-8">
      <h2 className="font-serif text-accent mb-4 text-xl font-semibold sm:text-2xl">
        Backing track
      </h2>

      <div className="bg-base-200 border-base-300 rounded-box border p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            disabled={!ready}
            aria-label={playing ? 'Pause backing track' : 'Play backing track'}
            className="bg-accent text-accent-content flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
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
              disabled={!ready}
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
      </div>

      {/* The player still runs — it's just parked off-screen, so only the
          audio reaches the user. Never display:none it: playback stops. */}
      <div
        ref={hostRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 -left-[9999px] h-px w-px overflow-hidden"
      />
    </section>
  );
};

export default BackingTrack;
