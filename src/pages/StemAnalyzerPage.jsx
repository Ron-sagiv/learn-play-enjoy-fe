import { useState, useEffect } from 'react';
import StemCard from '../components/StemCard';
import { NavLink } from 'react-router';
import { useAuthenticationContext } from '../context/AuthenticationContext';

const StemAnalyzer = () => {
  const { user } = useAuthenticationContext();
  const isAuthenticated = !!user;
  const [audiofiles, setAudiofiles] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/audiofiles`)
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

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 flex flex-col gap-5 border-b border-base-300 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral">
              Stem analyzer
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
              All process files
            </h1>
          </div>

          <NavLink
            to="/createstem"
            className="btn btn-primary w-full shadow-sm sm:w-auto"
          >
            Create new stem
          </NavLink>
        </header>

        {error && (
          <div role="alert" className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[repeat(auto-fill,minmax(22rem,1fr))]">
          {audiofiles.map((stem) => (
            <StemCard key={stem.id} stem={stem} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StemAnalyzer;
