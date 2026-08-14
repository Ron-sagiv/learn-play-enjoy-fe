import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { isSongSaved, saveSong, removeSavedSong } from '../utils/savedSongs';
import LessonsCarousel from '../components/LessonsCarousel';

const SingleSongPage = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/songs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setSong(data);
        setSaved(isSongSaved(data.id));
      })
      .catch(() => setError('We could not find this song.'));
  }, [id]);

  const toggleSave = () => {
    if (saved) {
      removeSavedSong(song.id);
      setSaved(false);
    } else {
      saveSong(song);
      setSaved(true);
    }
  };

  return (
    <div className="bg-base-100 text-base-content min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">
        {error && <p className="text-error">{error}</p>}

        {!error && !song && (
          <span className="loading loading-spinner text-primary" />
        )}

        {song && (
          <>
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-serif text-primary text-3xl font-semibold sm:text-5xl">
                  {song.title}
                </h1>
                <p className="text-neutral mt-2 text-base sm:text-lg">
                  {song.artist}
                </p>
              </div>

              <button
                onClick={toggleSave}
                className={`btn btn-sm sm:btn-md ${saved ? 'btn-secondary' : 'btn-outline btn-primary'}`}
              >
                {saved ? '★ Saved' : '☆ Save song'}
              </button>
            </header>
            <LessonsCarousel song={song} />
          </>
        )}
      </div>
    </div>
  );
};

export default SingleSongPage;
