import { useEffect, useMemo, useRef, useState } from 'react';
import { getYouTubeId, getThumbnailUrl, getEmbedUrl } from '../utils/youtube';

const LessonsCarousel = ({ song }) => {
  const [activeId, setActiveId] = useState(null);
  const [titles, setTitles] = useState({});
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const trackRef = useRef(null);

  const lessons = useMemo(() => {
    return [1, 2, 3, 4]
      .map((n) => ({
        id: getYouTubeId(song[`vidLesson${n}`]),
        label: `Lesson ${n}`,
      }))
      .filter((lesson) => lesson.id);
  }, [song]);

  //   const idsKey = lessons.map((l) => l.id).join(',');

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      lessons.map((lesson) =>
        fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${lesson.id}&format=json`,
        )
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => [lesson.id, data?.title])
          .catch(() => [lesson.id, null]),
      ),
    ).then((entries) => {
      if (cancelled) return;
      setTitles(Object.fromEntries(entries.filter(([, title]) => title)));
    });

    return () => {
      cancelled = true;
    };
  }, [lessons]); //it was idsKey before

  // Keep the arrows in sync with where the track actually is.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const update = () => {
      setAtStart(el.scrollLeft <= 1);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [lessons]); //was idsKey before

  // One card + one gap, measured from the DOM so it survives the sm: size change.
  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el) return;

    const [first, second] = el.children;
    const step = second
      ? second.offsetLeft - first.offsetLeft
      : (first?.offsetWidth ?? el.clientWidth);

    el.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  if (lessons.length === 0) return null;

  const arrowBase =
    'btn btn-circle btn-sm sm:btn-md bg-base-100/90 border-base-300 text-primary hover:bg-base-100 hover:border-accent absolute top-[28%] z-10 shadow-md backdrop-blur transition-opacity duration-200';

  return (
    <section className="mt-8">
      <h2 className="font-serif text-accent mb-4 text-xl font-semibold sm:text-2xl">
        Video lessons
      </h2>

      {activeId && (
        <div className="rounded-box border-base-300 mb-4 aspect-video w-full overflow-hidden border bg-black">
          <iframe
            key={activeId}
            src={getEmbedUrl(activeId)}
            title="Video lesson"
            className="h-full w-full"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => scrollByCard(-1)}
          disabled={atStart}
          aria-label="Previous lessons"
          className={`${arrowBase} -left-1 sm:-left-4 ${
            atStart ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          ‹
        </button>

        <button
          onClick={() => scrollByCard(1)}
          disabled={atEnd}
          aria-label="More lessons"
          className={`${arrowBase} -right-1 sm:-right-4 ${
            atEnd ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          ›
        </button>

        <ul
          ref={trackRef}
          className="carousel carousel-center w-full scroll-smooth gap-3 pb-2 sm:gap-4"
        >
          {lessons.map((lesson) => {
            const isActive = lesson.id === activeId;

            return (
              <li key={lesson.id} className="carousel-item w-56 sm:w-64">
                <button
                  onClick={() => setActiveId(lesson.id)}
                  className={`bg-base-200 rounded-box flex w-full flex-col overflow-hidden border text-left shadow-sm transition-all hover:shadow-md ${
                    isActive
                      ? 'border-secondary ring-secondary/40 ring-2'
                      : 'border-base-300 hover:border-accent'
                  }`}
                >
                  <span className="relative block aspect-video w-full overflow-hidden">
                    <img
                      src={getThumbnailUrl(lesson.id)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span className="bg-primary/80 text-primary-content absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-full text-sm">
                      ▶
                    </span>
                  </span>

                  <span className="flex flex-col gap-1 p-3">
                    <span className="text-secondary text-xs font-semibold tracking-[0.14em] uppercase">
                      {lesson.label}
                    </span>
                    <span className="text-base-content line-clamp-2 text-sm leading-snug">
                      {titles[lesson.id] ?? 'Loading title…'}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default LessonsCarousel;
