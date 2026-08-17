import { useState, useEffect } from 'react';
import StemCard from '../components/StemCard';
import { NavLink, Navigate } from 'react-router';
import { useAuthenticationContext } from '../context/AuthenticationContext';
import RecordView from '../components/Recorder';
import MusicPlayer from '../components/PlaySong';

const RecordingPage = () => {
  const { user } = useAuthenticationContext();
  const isAuthenticated = !!user;
  const [audiofiles, setAudiofiles] = useState([]);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recordings`)
        .then((res) => res.json())
        .then((data) => {
          //console.log(data);
          const records = data;
          setAudiofiles(records);
          setError(null);
        })
        .catch((err) => {
          console.error('Error fetching audiofiles:', err);
          setError(
            'Error fetching audiofiles , check console log for more details...',
          );
        });
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recorded song?'))
      return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/recordings/${id}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        alert('Audio Records deleted successfully!');
        setRedirect('/home');
      } else {
        const errorData = await response.json();
        console.error('Delete failed:', errorData);
        alert('Failed to delete audiofile.');
      }
    } catch (error) {
      console.error('Error deleting audiofile:', error);
      setError(
        'Error deleting audiofile , check console log for more details...',
      );
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <header className="mb-6">
        <h1 className="font-serif text-base-content text-3xl sm:text-4xl">
          All recorded files
        </h1>
        <p className="text-neutral mt-1 text-sm">
          Everything you've captured so far.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
        {audiofiles.map((song) => (
          <div
            key={song.id}
            className="bg-base-200 border-base-300 rounded-box flex flex-col border p-4 sm:p-5"
          >
            <p className="text-neutral text-xs tracking-wide uppercase">
              Original name
            </p>
            <h2 className="text-base-content mt-1 font-semibold break-all">
              {song.originalName}
            </h2>

            <div className="mt-4">
              <MusicPlayer link={song.filePath} />
            </div>

            <div className="border-base-300 mt-6 border-t pt-4" id={song.id}>
              <button
                onClick={() => handleDelete(song.id)}
                className="btn btn-sm btn-outline btn-error rounded-field w-full sm:w-auto"
              >
                Delete audio records
              </button>
            </div>
          </div>
        ))}
      </div>

      {audiofiles.length === 0 && !error && (
        <div className="border-base-300 rounded-box text-neutral border border-dashed px-4 py-10 text-center text-sm">
          No recordings yet. Record your first take below.
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="bg-error/10 border-error/30 text-error rounded-field mt-6 border px-4 py-3 text-sm"
        >
          {error}
        </div>
      )}

      <div className="border-base-300 mt-10 border-t pt-8">
        <RecordView />
      </div>
    </div>
  );
};

export default RecordingPage;
