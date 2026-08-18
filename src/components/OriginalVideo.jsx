import { useEffect, useState } from 'react';
import { getYouTubeId, getThumbnailUrl, getEmbedUrl } from '../utils/youtube';

const OriginalVideo = ({ song }) => {
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState('');
  const videoId = getYouTubeId(song.videoUrl);

  useEffect(() => {
    if (!videoId) return;
    let cancelled = false;

    fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => !cancelled && data?.title && setTitle(data.title))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [videoId]);

  if (!videoId) return null;

  return (
    <section className="mt-8">
      <h2 className="font-serif text-accent mb-4 text-xl font-semibold sm:text-2xl">
        The original
      </h2>

      {playing ? (
        <div className="rounded-box border-base-300 aspect-video w-full overflow-hidden border bg-black">
          <iframe
            src={getEmbedUrl(videoId)}
            title="Original video"
            className="h-full w-full"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="rounded-box border-base-300 hover:border-highlight group relative block w-full overflow-hidden border shadow-sm transition-all hover:shadow-md"
        >
          <img
            src={getThumbnailUrl(videoId)}
            alt=""
            loading="lazy"
            className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-48"
          />

          {/* dark wash so the text stays readable over any frame */}
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <span className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4">
            <span className="bg-highlight text-highlight-content flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg shadow-lg transition-transform group-hover:scale-110">
              ▶
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-xs font-semibold tracking-[0.14em] text-white/70 uppercase">
                Listen to the song
              </span>
              <span className="font-serif line-clamp-2 block text-base font-semibold text-white sm:text-lg">
                {title || `${song.title} — ${song.artist}`}
              </span>
            </span>
          </span>
        </button>
      )}
    </section>
  );
};

export default OriginalVideo;
