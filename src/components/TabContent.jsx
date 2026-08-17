const TabContent = ({ song }) => {
  if (!song.tabContent) return null;

  // "Intro/Verse: D - C - G - D" -> label + the rest, when there's a colon.
  const splitAt = song.tabContent.indexOf(':');
  const hasLabel = splitAt > 0 && splitAt < 40;
  const label = hasLabel ? song.tabContent.slice(0, splitAt) : null;
  const body = hasLabel
    ? song.tabContent.slice(splitAt + 1).trim()
    : song.tabContent;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-accent text-xl font-semibold sm:text-2xl">
          How it goes
        </h2>
        {song.tabSite && (
          <a
            href={song.tabSite}
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary text-sm font-medium"
          >
            Full Tab Link ↗
          </a>
        )}
      </div>

      <div className="bg-base-200 border-base-300 rounded-box overflow-hidden border shadow-sm">
        {label && (
          <div className="border-base-300 bg-base-300/40 border-b px-4 py-2 sm:px-5">
            <span className="text-secondary text-xs font-semibold tracking-[0.14em] uppercase">
              {label}
            </span>
          </div>
        )}

        {/* horizontal scroll keeps long tabs from squashing on mobile */}
        <div className="overflow-x-auto px-4 py-4 sm:px-5 sm:py-5">
          <pre className="text-base-content font-mono text-sm leading-relaxed whitespace-pre sm:text-base">
            {body}
          </pre>
        </div>
      </div>
    </section>
  );
};

export default TabContent;