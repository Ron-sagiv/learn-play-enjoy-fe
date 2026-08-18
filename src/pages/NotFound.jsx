import { Link } from 'react-router';

const STRINGS = [24, 44, 64, 84, 104, 124];

const NotFound = () => {
  return (
    <main className="flex min-h-[80svh] flex-col items-center justify-center px-6 py-16 text-center">
      {/* 404 written as guitar tab */}
      <svg
        viewBox="0 0 340 148"
        role="img"
        aria-label="Guitar tab reading 4, 0, 4"
        className="w-full max-w-sm text-primary sm:max-w-md"
      >
        {/* TAB clef */}
        <text
          x="14"
          y="52"
          className="fill-neutral font-sans text-[19px] font-bold tracking-widest"
        >
          T
        </text>
        <text
          x="14"
          y="81"
          className="fill-neutral font-sans text-[19px] font-bold tracking-widest"
        >
          A
        </text>
        <text
          x="14"
          y="110"
          className="fill-neutral font-sans text-[19px] font-bold tracking-widest"
        >
          B
        </text>

        {/* strings — thicker as they go low */}
        {STRINGS.map((y, i) => (
          <line
            key={y}
            x1="48"
            x2="330"
            y1={y}
            y2={y}
            stroke="currentColor"
            strokeWidth={0.9 + i * 0.25}
            opacity="0.45"
          />
        ))}

        {/* bar lines */}
        <line
          x1="48"
          x2="48"
          y1="24"
          y2="124"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.45"
        />
        <line
          x1="330"
          x2="330"
          y1="24"
          y2="124"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.45"
        />

        {/* fret numbers: 4 — 0 — 4 */}
        <g className="font-sans text-[34px] font-extrabold">
          <rect
            x="92"
            y="26"
            width="40"
            height="36"
            className="fill-base-100"
          />
          <text
            x="112"
            y="44"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="currentColor"
          >
            4
          </text>

          <rect
            x="170"
            y="66"
            width="40"
            height="36"
            className="fill-base-100"
          />
          <text
            x="190"
            y="84"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-highlight"
          >
            0
          </text>

          <rect
            x="248"
            y="46"
            width="40"
            height="36"
            className="fill-base-100"
          />
          <text
            x="268"
            y="64"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="currentColor"
          >
            4
          </text>
        </g>
      </svg>

      <h1 className="mt-10 font-serif text-3xl font-semibold text-base-content sm:text-4xl">
        This page isn&apos;t in the songbook
      </h1>

      <p className="mt-3 max-w-sm text-base text-neutral">
        The link is broken or the page has moved. Head back and pick a song to
        learn.
      </p>

      <Link to="/home" className="btn btn-primary mt-8 px-8">
        Back to songs
      </Link>
    </main>
  );
};

export default NotFound;
