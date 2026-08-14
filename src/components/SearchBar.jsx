import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

const SEARCH_URL = `${import.meta.env.VITE_API_BASE_URL}/api/songs/search`;

// Difficulty -> daisyUI badge color, using your theme slots.
const DIFFICULTY_BADGE = {
  Beginner: 'badge-success',
  Intermediate: 'badge-warning',
  Advanced: 'badge-error',
};

/**
 * SearchBar
 * Search field with a suggestions dropdown.
 * Picking a song opens its page, unless a parent passes onSelect.
 */
export default function SearchBar({ onSelect }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');

  // Results are stored with the query they belong to, so the render can tell
  // whether they are still current.
  const [data, setData] = useState({ query: '', songs: [] });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const trimmed = query.trim();

  const results = data.query === trimmed ? data.songs : [];
  const isSearching =
    isLoading || (trimmed.length >= 2 && data.query !== trimmed);

  /* ---------------------------------------------------------------
     1. Fetch suggestions, debounced 300ms.
  ---------------------------------------------------------------- */
  useEffect(() => {
    if (trimmed.length < 2) return;

    let cancelled = false;

    const timer = setTimeout(() => {
      setIsLoading(true);

      fetch(`${SEARCH_URL}?q=${encodeURIComponent(trimmed)}`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((json) => {
          if (cancelled) return;
          const songs = Array.isArray(json) ? json : (json.songs ?? []);
          setData({ query: trimmed, songs });
        })
        .catch(() => {
          if (!cancelled) setData({ query: trimmed, songs: [] });
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed]);

  /* ---------------------------------------------------------------
     2. Close on click outside and on Esc.
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
     3. Picking a song: close up, then open its page.
        A parent can take over by passing onSelect.
  ---------------------------------------------------------------- */
  function handleSelect(song) {
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur(); // stops the mobile keyboard covering the next page

    if (onSelect) {
      setQuery(song.title);
      onSelect(song);
      return;
    }

    setQuery(''); // leave the field clean for the next search
    navigate(`/songs/${song.id ?? song._id}`);
  }

  /* ---------------------------------------------------------------
     4. Keyboard navigation. Enter with nothing highlighted picks the
        first result, which is what people expect after typing.
  ---------------------------------------------------------------- */
  function handleKeyDown(event) {
    if (!isOpen || results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      handleSelect(results[activeIndex >= 0 ? activeIndex : 0]);
    }
  }

  const showDropdown = isOpen && trimmed.length >= 2;

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-xl">
      {/* ---------- Input row ---------- */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-neutral pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2"
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
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="rounded-field border-base-300 bg-base-100 text-base-content placeholder:text-neutral focus:border-primary focus:ring-primary/30 w-full border py-3 pr-11 pl-12 text-base outline-none transition-colors focus:ring-2 [&::-webkit-search-cancel-button]:appearance-none"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="song-suggestions"
          aria-autocomplete="list"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="text-neutral hover:bg-base-300 hover:text-base-content absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full transition-colors"
            aria-label="Clear search"
          >
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
          className="rounded-box border-base-300 bg-base-200 absolute z-50 mt-2 max-h-80 w-full overflow-y-auto border shadow-lg"
        >
          {isSearching && (
            <li className="text-neutral px-4 py-3 text-sm">Searching…</li>
          )}

          {!isSearching && results.length === 0 && (
            <li className="text-neutral px-4 py-3 text-sm">
              No songs match “{trimmed}”. Try another title or artist.
            </li>
          )}

          {!isSearching &&
            results.map((song, index) => (
              <li
                key={song.id ?? song._id ?? index}
                role="option"
                aria-selected={index === activeIndex}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(song)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`border-base-300/60 flex w-full items-center justify-between gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 ${
                    index === activeIndex
                      ? 'bg-base-300'
                      : 'hover:bg-base-300/60'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="font-serif text-base-content block truncate font-semibold">
                      {song.title}
                    </span>
                    <span className="text-neutral block truncate text-sm">
                      {song.artist}
                      {song.genre ? ` · ${song.genre}` : ''}
                    </span>
                  </span>

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
