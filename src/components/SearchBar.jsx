// Still needs to configure when the backend is connected:
// /search must be declared before any /:id route in the same file, otherwise Express will treat "search" as an id.
import { useState, useEffect, useRef } from 'react';

// Where the backend lives. Change this one line if your route is different.
const SEARCH_URL = '/api/songs/search';

// Difficulty -> daisyUI badge color, using your theme slots.
const DIFFICULTY_BADGE = {
  Beginner: 'badge-success',
  Intermediate: 'badge-warning',
  Advanced: 'badge-error',
};

/**
 * SongSearch
 * A search field with a suggestions dropdown.
 * Props:
 *   onSelect(song) - called when the user picks a song (click or Enter). Optional.
 */
export default function SongSearch({ onSelect }) {
  const [query, setQuery] = useState(''); // what the user typed
  const [results, setResults] = useState([]); // songs coming back from the backend
  const [isOpen, setIsOpen] = useState(false); // is the dropdown visible
  const [isLoading, setIsLoading] = useState(false); // request in flight
  const [activeIndex, setActiveIndex] = useState(-1); // highlighted row for arrow keys

  const containerRef = useRef(null); // wrapper, used to detect clicks outside
  const inputRef = useRef(null); // the input itself, so we can blur it on Esc

  /* ---------------------------------------------------------------
     1. Fetch suggestions, debounced.
     We wait 300ms after the last keystroke so we don't hit the backend
     on every single letter. The cleanup cancels the pending timer and
     ignores answers from an outdated request.
  ---------------------------------------------------------------- */
  useEffect(() => {
    const q = query.trim();

    // Nothing meaningful typed yet - clear and stop.
    if (q.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    const timer = setTimeout(() => {
      fetch(`${SEARCH_URL}?q=${encodeURIComponent(q)}`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((data) => {
          if (cancelled) return;
          // Accept either a plain array or { songs: [...] }
          setResults(Array.isArray(data) ? data : (data.songs ?? []));
          setActiveIndex(-1);
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  /* ---------------------------------------------------------------
     2. Close on click outside and on Esc.
     Both listeners sit on the document because the click/keypress can
     happen anywhere on the page, not just inside this component.
  ---------------------------------------------------------------- */
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  /* ---------------------------------------------------------------
     3. Picking a song: fill the input, close the dropdown, tell the parent.
  ---------------------------------------------------------------- */
  function handleSelect(song) {
    setQuery(song.title);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect?.(song);
  }

  /* ---------------------------------------------------------------
     4. Keyboard navigation inside the input: arrows move the highlight,
        Enter picks the highlighted row.
  ---------------------------------------------------------------- */
  function handleKeyDown(event) {
    if (!isOpen || results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault(); // stop the caret from jumping in the input
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      handleSelect(results[activeIndex]);
    }
  }

  // Show the dropdown only when it has something to say.
  const showDropdown = isOpen && query.trim().length >= 2;

  return (
    // relative = the anchor the absolute dropdown positions itself against
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      {/* ---------- Input row ---------- */}
      <div className="relative">
        {/* Magnifier icon, sits inside the field on the left */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>

        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Search by song or artist"
          // typing reopens the dropdown, focusing an existing query reopens it too
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          // pl-12 leaves room for the icon, pr-11 for the clear button
          className="w-full rounded-field border border-base-300 bg-base-100 py-3 pl-12 pr-11
                     text-base text-base-content placeholder:text-neutral
                     outline-none transition-colors
                     focus:border-primary focus:ring-2 focus:ring-primary/30
                     [&::-webkit-search-cancel-button]:appearance-none"
          // accessibility: tells screen readers this input drives a listbox
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="song-suggestions"
          aria-autocomplete="list"
        />

        {/* Clear button - only when there is text */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center
                       rounded-full text-neutral transition-colors hover:bg-base-300 hover:text-base-content"
            aria-label="Clear search"
          >
            {/* small × */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-4 w-4"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* ---------- Dropdown ---------- */}
      {showDropdown && (
        <ul
          id="song-suggestions"
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-box border border-base-300
                     bg-base-200 shadow-lg max-h-80 overflow-y-auto"
        >
          {/* Loading state */}
          {isLoading && (
            <li className="px-4 py-3 text-sm text-neutral">Searching…</li>
          )}

          {/* Empty state - only once the request finished */}
          {!isLoading && results.length === 0 && (
            <li className="px-4 py-3 text-sm text-neutral">
              No songs match “{query.trim()}”. Try another title or artist.
            </li>
          )}

          {/* Results */}
          {!isLoading &&
            results.map((song, index) => (
              <li
                key={song._id ?? index}
                role="option"
                aria-selected={index === activeIndex}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(song)}
                  onMouseEnter={() => setActiveIndex(index)} // hover follows the keyboard highlight
                  className={`flex w-full items-center justify-between gap-3 border-b border-base-300/60
                              px-4 py-3 text-left transition-colors last:border-b-0
                              ${index === activeIndex ? 'bg-base-300' : 'hover:bg-base-300/60'}`}
                >
                  <span className="min-w-0">
                    {/* Title in the display face, artist muted underneath */}
                    <span className="block truncate font-serif font-semibold text-base-content">
                      {song.title}
                    </span>
                    <span className="block truncate text-sm text-neutral">
                      {song.artist}
                      {song.genre ? ` · ${song.genre}` : ''}
                    </span>
                  </span>

                  {/* Difficulty badge */}
                  {song.difficulty && (
                    <span
                      className={`badge badge-sm shrink-0 ${DIFFICULTY_BADGE[song.difficulty] ?? ''}`}
                    >
                      {song.difficulty}
                    </span>
                  )}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
