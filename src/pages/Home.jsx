import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import MyChatBot from '../components/ChatBot';
import MusicPlayer from '../components/PlaySong';
import SearchBar from '../components/SearchBar';
import { useAuthenticationContext } from '../context/AuthenticationContext';
import { getLastSong } from '../utils/lastSong';
import { getSavedSongs, removeSavedSong } from '../utils/savedSongs';

// Difficulty -> daisyUI badge color, same mapping as SearchBar.
const DIFFICULTY_BADGE = {
  Beginner: 'badge-success',
  Intermediate: 'badge-warning',
  Advanced: 'badge-error',
};

const Home = () => {
  const { user } = useAuthenticationContext();
  const lastSong = getLastSong();
  const [suggestions, setSuggestions] = useState([]);
  const [savedSongs, setSavedSongs] = useState(getSavedSongs);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/songs`)
      .then((res) => res.json())
      .then((songs) => {
        if (songs.length <= 2) return setSuggestions(songs);

        // pick one at random, then a second one that isn't the first
        const first = Math.floor(Math.random() * songs.length);
        let second = Math.floor(Math.random() * (songs.length - 1));
        if (second >= first) second += 1; // skip over the index we already took

        setSuggestions([songs[first], songs[second]]);
      })
      .catch(() => setSuggestions([]));
  }, []);

  return (
    <div className="bg-base-100 text-base-content min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-3xl space-y-10">
        {/* ---------- Greeting ---------- */}
        <header>
          <p className="text-secondary mb-2 text-xs font-semibold tracking-[0.18em] uppercase">
            Learn, Play, Enjoy!
          </p>
          <h1 className="font-serif text-3xl font-semibold sm:text-5xl">
            <span className="text-primary">Hi </span>
            <span className="text-highlight">{user?.name}</span>
          </h1>
          <p className="text-neutral mt-2 text-sm">
            What are you playing today?
          </p>
        </header>

        {/* ---------- Search ---------- */}
        <SearchBar />

        {/* only on local storage */}
        {lastSong && (
          <Link
            to={`/songs/${lastSong.id}`}
            className="bg-secondary/15 border-secondary/40 rounded-box hover:bg-secondary/25 group flex items-center gap-4 border p-4 transition-colors sm:p-5"
          >
            {/* little play mark */}
            <span className="bg-secondary text-secondary-content flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg">
              ▶
            </span>
            <span className="min-w-0">
              <span className="text-secondary block text-xs font-semibold tracking-[0.14em] uppercase">
                Last song you learned
              </span>
              <span className="font-serif block truncate text-lg font-semibold sm:text-xl">
                {lastSong.title}
              </span>
              <span className="text-neutral block truncate text-sm">
                {lastSong.artist}
              </span>
            </span>
            <span className="text-secondary ml-auto shrink-0 text-xl transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        )}

        {/* ---------- Suggestions ---------- */}
        {suggestions.length > 0 && (
          <section>
            <h2 className="font-serif text-accent mb-4 text-2xl font-semibold sm:text-3xl">
              Song suggestions
            </h2>

            <ul className="grid gap-4 sm:grid-cols-2">
              {suggestions.map((song) => (
                <li key={song.id}>
                  <Link
                    to={`/songs/${song.id}`}
                    className="bg-base-200 border-base-300 rounded-box hover:border-accent flex h-full flex-col gap-2 border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="font-serif text-primary text-lg font-semibold sm:text-xl">
                      {song.title}
                    </span>
                    <span className="text-neutral text-sm">{song.artist}</span>

                    <span className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                      {song.difficulty && (
                        <span
                          className={`badge badge-sm ${DIFFICULTY_BADGE[song.difficulty] ?? ''}`}
                        >
                          {song.difficulty}
                        </span>
                      )}
                      {song.genre && (
                        <span className="badge badge-sm badge-outline border-base-300 text-neutral">
                          {song.genre}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Player + chatbot ---------- */}
        <div className="bg-base-200 border-base-300 rounded-box border p-4 sm:p-6">
          <MusicPlayer />
        </div>

        {/* ---------- Saved songs ---------- */}
        <section>
          <h2 className="font-serif text-accent mb-4 text-2xl font-semibold sm:text-3xl">
            Your saved songs
          </h2>

          {savedSongs.length === 0 ? (
            <p className="text-neutral border-base-300 rounded-box border border-dashed p-5 text-sm">
              Nothing saved yet. Open a song and tap “Save song” to keep it
              here.
            </p>
          ) : (
            <ul className="divide-base-300 bg-base-200 border-base-300 rounded-box divide-y border">
              {savedSongs.map((song) => (
                <li key={song.id} className="flex items-center gap-3 p-4">
                  <Link
                    to={`/songs/${song.id}`}
                    className="group min-w-0 flex-1"
                  >
                    <span className="font-serif text-primary group-hover:text-highlight block truncate font-semibold transition-colors">
                      {song.title}
                    </span>
                    <span className="text-neutral block truncate text-sm">
                      {song.artist}
                    </span>
                  </Link>

                  {song.difficulty && (
                    <span
                      className={`badge badge-sm hidden sm:inline-flex ${DIFFICULTY_BADGE[song.difficulty] ?? ''}`}
                    >
                      {song.difficulty}
                    </span>
                  )}

                  <button
                    onClick={() => setSavedSongs(removeSavedSong(song.id))}
                    aria-label={`Remove ${song.title}`}
                    className="btn btn-ghost btn-xs text-neutral hover:text-error shrink-0"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <MyChatBot />
      </div>
    </div>
  );
};

export default Home;
