import { Link } from 'react-router';

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

/** Six horizontal lines = guitar strings. Used as a section divider. */
function StringDivider({ className = '' }) {
  const gauges = [0.6, 0.75, 0.95, 1.2, 1.5, 1.9]; // high E -> low E
  return (
    <div className={`w-full ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 28"
        className="h-5 w-full sm:h-7"
        preserveAspectRatio="none"
      >
        {gauges.map((g, i) => (
          <line
            key={i}
            x1="0"
            x2="1200"
            y1={3 + i * 4.4}
            y2={3 + i * 4.4}
            stroke="currentColor"
            strokeWidth={g}
            className="text-base-300"
          />
        ))}
      </svg>
    </div>
  );
}

/** Feature card with a small inline icon. */
function FeatureCard({ icon, title, children }) {
  return (
    <div className="card border border-base-300 bg-base-100 transition-transform duration-200 hover:border-secondary motion-safe:hover:-translate-y-1">
      <div className="card-body gap-3 p-5 sm:p-6">
        <span className="grid size-10 place-items-center rounded-field bg-secondary/20 text-primary sm:size-11">
          {icon}
        </span>
        <h3 className="card-title text-base leading-snug sm:text-lg">
          {title}
        </h3>
        {children ? (
          <p className="text-sm text-base-content/70">{children}</p>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Icons (kept tiny + consistent: 1.6 stroke, 24 box)                  */
/* ------------------------------------------------------------------ */

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'size-5 sm:size-6',
};

const IconSearch = (
  <svg {...iconProps}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </svg>
);

const IconSpark = (
  <svg {...iconProps}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
  </svg>
);

const IconTeachers = (
  <svg {...iconProps}>
    <rect x="3" y="6" width="13" height="9" rx="2" />
    <path d="M18 8.5h1.5a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5H8" />
    <path d="M9 9.2l3.2 1.8L9 12.8z" />
  </svg>
);

const IconTrack = (
  <svg {...iconProps}>
    <path d="M4 12v0M7.5 8.5v7M11 5.5v13M14.5 9v6M18 11v2M21 12v0" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const LESSONS = [
  {
    id: 'IzxMeQgtyYE',
    channel: 'Marty Music',
    note: 'Acoustic, start to finish',
    len: '15:09',
  },
  {
    id: 'o2NaGFteNvY',
    channel: 'GuitarZero2Hero Express',
    note: 'Follow the tab',
    len: '05:48',
  },
  {
    id: 'yDY6y8llnA0',
    channel: 'JustinGuitar Songs',
    note: 'Simplified chords and rhythm',
    len: '16:27',
  },
  {
    id: 'EPVef6YlOLw',
    channel: 'GuitarZero2Hero',
    note: 'The complete arrangement',
    len: '34:32',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Find the song',
    body: 'Search by title or artist and open its lesson page.',
  },
  {
    step: '02',
    title: 'Pick your teacher',
    body: 'Compare a few videos and stay with whoever explains it your way.',
  },
  {
    step: '03',
    title: 'Play it through',
    body: 'Run it with the backing track until it sounds like the record.',
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Welcome() {
  return (
    <>
      {/* ============================= HERO ============================= */}
      <section className="relative w-full max-w-full overflow-x-hidden">
        {/* Warm ambient wash. Two blurred fields rather than a gradient string:
            Tailwind v4 resolves daisyUI colours as CSS vars, so theme() inside
            an arbitrary value silently produces nothing. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-32 -right-24 size-80 rounded-full bg-secondary/25 blur-3xl sm:size-[28rem]" />
          <div className="absolute -bottom-32 -left-24 size-72 rounded-full bg-accent/15 blur-3xl sm:size-96" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* ---- copy ---- */}
            <div className="min-w-0">
              <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Learn the songs you actually{' '}
                <span className="relative inline-block text-primary">
                  want to play
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 300 12"
                    className="absolute -bottom-1 left-0 w-full text-highlight sm:-bottom-2"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 8c60-6 120-6 180-3s90 4 116 1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base text-pretty text-base-content/75 sm:mt-8 sm:text-lg">
                Every song comes with a handful of video lessons from different
                teachers. Pick the one that clicks, play along with the backing
                track, and enjoy the song by the end of the week.
              </p>

              {/* ---- primary actions ---- */}
              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                <Link
                  to="/signup"
                  className="btn btn-primary btn-lg w-full text-base shadow-md sm:w-auto sm:px-10"
                >
                  Start learning free
                </Link>
                <Link
                  to="/login"
                  className="btn btn-accent btn-lg w-full text-base sm:w-auto sm:px-10"
                >
                  Log in
                </Link>
              </div>

              <p className="mt-5 text-sm text-base-content/60">
                Takes about a minute to set up. Nothing to install.
              </p>
            </div>

            {/* ---- signature: one song, several teachers ---- */}
            <div className="relative mx-auto w-full min-w-0 max-w-md">
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-box bg-secondary/15 blur-2xl sm:-inset-6"
              />

              {/* fanned-out lesson cards */}
              <div className="relative">
                <div className="absolute inset-x-4 -top-4 h-24 rotate-[-4deg] rounded-box border border-base-300 bg-base-200 sm:inset-x-6 sm:-top-6" />
                <div className="absolute inset-x-2 -top-2 h-24 rotate-[2deg] rounded-box border border-base-300 bg-base-200 sm:inset-x-3 sm:-top-3" />

                <div className="relative rounded-box border border-base-300 bg-base-100 p-4 shadow-lg sm:p-6">
                  <p className="text-xs tracking-[0.18em] text-neutral uppercase">
                    Now learning
                  </p>
                  <h2 className="mt-1 font-serif text-xl sm:text-2xl">
                    Wish You Were Here
                  </h2>
                  <p className="text-sm text-base-content/60">
                    Pink Floyd · Beginner · 4 lessons
                  </p>

                  <ul className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
                    {LESSONS.map((lesson) => (
                      <li
                        key={lesson.id}
                        className="flex items-center gap-3 rounded-field border border-base-300 bg-base-200 p-2"
                      >
                        <span className="relative block w-20 shrink-0 overflow-hidden rounded-[calc(var(--radius-field)-2px)] sm:w-24">
                          <img
                            src={`https://img.youtube.com/vi/${lesson.id}/mqdefault.jpg`}
                            alt=""
                            loading="lazy"
                            width="320"
                            height="180"
                            className="aspect-video w-full object-cover"
                          />
                          <span className="absolute inset-0 grid place-items-center bg-primary/35">
                            <span className="grid size-6 place-items-center rounded-full bg-base-100/90 text-primary sm:size-7">
                              <svg
                                viewBox="0 0 24 24"
                                className="size-3 sm:size-3.5"
                                fill="currentColor"
                              >
                                <path d="M8 5.5v13l11-6.5z" />
                              </svg>
                            </span>
                          </span>
                        </span>

                        <span className="min-w-0 flex-1 py-1">
                          <span className="block truncate text-sm font-medium">
                            {lesson.channel}
                          </span>
                          <span className="block truncate text-xs text-base-content/60">
                            {lesson.note}
                          </span>
                        </span>

                        <span className="shrink-0 pr-1 text-xs tabular-nums text-neutral sm:pr-2">
                          {lesson.len}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-center text-xs text-base-content/55 sm:mt-5">
                    One song. Four teachers. Your pick.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <StringDivider />
      </section>

      {/* =========================== FEATURES =========================== */}
      <section
        id="features"
        className="bg-base-200 px-5 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.2em] text-accent uppercase">
              What you get
            </p>
            <h2 className="mt-3 font-serif text-3xl text-balance sm:text-4xl lg:text-5xl">
              Everything the song needs, in one place
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            <FeatureCard icon={IconSearch} title="Learn any song">
              Search the song, get the lessons. No hunting through playlists.
            </FeatureCard>

            <FeatureCard icon={IconSpark} title="Learn faster, enjoy playing">
              Short, focused lessons so you spend your time playing, not
              scrubbing.
            </FeatureCard>

            <FeatureCard
              icon={IconTeachers}
              title="Multiple video lessons per song"
            >
              Three to five takes from different teachers. Different styles,
              same song.
            </FeatureCard>

            <FeatureCard
              icon={IconTrack}
              title="Play along with backing tracks"
            >
              Drop into the full band and hear how your part fits.
            </FeatureCard>
          </div>

          {/* ---- the fifth one, given its own weight ---- */}
          <div className="mt-4 flex flex-col items-center gap-4 rounded-box border border-highlight/40 bg-highlight/10 px-5 py-6 text-center sm:mt-8 sm:flex-row sm:px-8 sm:py-7 sm:text-left">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-highlight text-highlight-content sm:size-12">
              <svg {...iconProps} className="size-6">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl">Easy to use</h3>
              <p className="text-sm text-base-content/70 sm:text-base">
                Open a song, press play, start playing. That is the whole thing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== HOW IT WORKS ======================== */}
      <section className="px-5 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-3xl text-balance sm:text-4xl lg:text-5xl">
            From song to played
          </h2>

          <ol className="mt-8 grid gap-8 sm:mt-12 sm:grid-cols-3 sm:gap-10">
            {STEPS.map((item) => (
              <li key={item.step}>
                <span className="font-serif text-2xl text-secondary sm:text-3xl">
                  {item.step}
                </span>
                <div className="mt-2 h-px w-12 bg-base-300 sm:mt-3" />
                <h3 className="mt-3 text-lg font-medium sm:mt-4 sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-base-content/70 sm:text-base">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================ CTA BAND ========================== */}
      <section className="bg-primary px-5 py-14 text-primary-content sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center sm:gap-8">
          <h2 className="font-serif text-3xl text-balance sm:text-4xl lg:text-5xl">
            Pick a song. Play it by the weekend.
          </h2>
          <p className="max-w-xl text-pretty text-primary-content/80">
            Create an account and your first lesson is one click away.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Link
              to="/signup"
              className="btn btn-secondary btn-lg w-full sm:w-auto sm:px-10"
            >
              Create free account
            </Link>
            <Link
              to="/login"
              className="btn btn-accent btn-lg w-full sm:w-auto sm:px-10"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
