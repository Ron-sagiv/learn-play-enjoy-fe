import { useState } from 'react';
import { NavLink,Navigate } from 'react-router';

const CreateStem = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const bodyText = { stemType: 'Guitar' };

    formData.append('body', JSON.stringify(bodyText));
    formData.append('file', file);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/stems`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      },
    ).catch((err) => {
      console.error('Error creating stem details:', err);
      setError('Error creating stem , check console log for more details...');
    });

    if (response.ok) {
      alert('Stem analyzer successfully triggered!');
      setError(null);
      setRedirect('/stems');
    } else {
      setError('Error creating stem , check console log for more details...');
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <NavLink
          to="/stems"
          className="btn btn-ghost btn-sm gap-2 -ml-2 text-neutral"
        >
          <span aria-hidden="true">&larr;</span>
          Back to stem analyzer
        </NavLink>

        <header className="mt-6 mb-8 border-b border-base-300 pb-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral">
            New analysis
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
            Upload a song to pull out the guitar
          </h2>
          <p className="mt-3 text-sm text-neutral">
            Pick an audio file and we&rsquo;ll separate the guitar track from
            the mix.
          </p>
        </header>

        <div className="rounded-box border border-base-300 bg-base-200 p-4 sm:p-6">
          <form className="space-y-5">
            <div>
              <label htmlFor="file" className="mb-2 block text-sm font-medium">
                Audio file
              </label>
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full bg-base-100 file:bg-accent file:text-accent-content file:border-0"
              />
              {file && (
                <p className="mt-2 text-xs break-all text-neutral">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {file && (
              <button
                onClick={handleSubmit}
                className="btn btn-primary w-full sm:w-auto"
              >
                Start analysis
              </button>
            )}
          </form>

          {error && (
            <div role="alert" className="alert alert-error mt-5">
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CreateStem;
