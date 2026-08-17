import { useAuthenticationContext } from '../context/AuthenticationContext';
import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router';
import { NavLink } from 'react-router';

import MusicPlayer from '../components/PlaySong';

const StemDetails = () => {
  const { user } = useAuthenticationContext();
  const isAuthenticated = !!user;
  const { id } = useParams();
  const [audiofile, setAudiofile] = useState([]);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [redirect, setRedirect] = useState('');
  const [filename, setFilename] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/audiofiles/${id}`)
        .then((res) => res.json())
        .then((data) => {
          //console.log('data:', data);
          let inFile = data.inputFile;
          //console.log('inFile:', inFile);
          inFile = inFile.split('/').pop();
          //console.log('inFile:', inFile);
          setFilename(inFile);
          setAudiofile(data);
          setError(null);
        })
        .catch((err) => {
          setError(
            'Error fetching audio file details , check console log for more details...',
          );
        });
    }
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto w-full max-w-3xl">
          <div role="alert" className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!audiofile) {
    return (
      <div className="min-h-screen bg-base-100 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 text-neutral">
          <span className="loading loading-spinner loading-sm" />
          <p>Loading....</p>
        </div>
      </div>
    );
  }
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this analyzed song?'))
      return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/audiofiles/${id}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        alert('Audio Records deleted successfully!');
        setRedirect('/stems');
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
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <NavLink
          to="/stems"
          className="btn btn-ghost btn-sm gap-2 -ml-2 text-neutral"
        >
          <span aria-hidden="true">&larr;</span>
          Back to stem analyzer
        </NavLink>

        <header className="mt-6 mb-8 border-b border-base-300 pb-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral">
            Stem details
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
            Listen to the original and the guitar
          </h1>
        </header>

        <div className="space-y-5">
          <section className="rounded-box border border-base-300 bg-base-200 p-4 sm:p-6">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-lg font-semibold">
                Original file
              </h2>
              <span className="badge badge-sm border-base-300 bg-base-100 text-neutral">
                Full mix
              </span>
            </div>
            <a
              href={audiofile.inputFile}
              className="link link-hover text-sm break-all text-neutral"
            >
              {audiofile.inputFile?.split('-')[1]}
            </a>
            <div className="mt-4">
              <MusicPlayer link={audiofile.inputFile} />
            </div>
          </section>

          <section className="rounded-box border border-base-300 bg-base-200 p-4 sm:p-6">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-lg font-semibold">Guitar stem</h2>
              <span className="badge badge-sm border-none bg-accent text-accent-content">
                Analyzed
              </span>
            </div>
            <a
              href={audiofile.outputFile}
              className="link link-hover text-sm break-all text-neutral"
            >
              {audiofile.outputFile?.split('-')[1]}
            </a>
            <div className="mt-4">
              <MusicPlayer link={audiofile.outputFile} />
            </div>
          </section>
        </div>

        <div className="mt-10 border-t border-base-300 pt-6">
          <button
            onClick={handleDelete}
            className="btn btn-sm btn-outline btn-error w-full sm:w-auto"
          >
            Delete audio records
          </button>
        </div>
      </div>
    </div>
  );
};

export default StemDetails;
