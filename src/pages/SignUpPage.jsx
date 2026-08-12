import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';

// Key used for the locally stored user.
// Exported so the sign-out button can import it instead of retyping the string.
export const USER_STORAGE_KEY = 'lpe_user';

const Required = () => (
  <span className="text-highlight ml-0.5" aria-hidden="true">
    *
  </span>
);
export default function SignUpPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usercategory, setUsercategory] = useState('');
  const [level, setLevel] = useState('');
  const [instrument, setInstrument] = useState('');
  const [favband, setFavband] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            usercategory,
            level,
            instrument,
            favband,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      /* --- Local storage -------------------------------------------------
         Keep a local copy of the user so the app still knows who signed up
         after a page refresh. The backend stays the source of truth, this
         is only a cache.

         - Stored as a JSON string, because localStorage holds strings only.
         - `data.user ?? data` covers both response shapes: a backend that
           wraps the user under a `user` key, and one that returns the user
           object at the top level.
         - The password is never stored. Only what the backend sent back.
         - Cleared on sign out, see the note under the component.
      ------------------------------------------------------------------- */
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user ?? data));

      setSuccess('Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-base-100 text-base-content min-h-screen px-4 py-10 sm:px-6 sm:py-16">
      <form
        onSubmit={handleRegister}
        className="bg-base-200 border-base-300 rounded-box mx-auto w-full max-w-md border p-6 shadow-sm sm:p-8"
      >
        <header className="mb-8">
          <p className="text-secondary mb-2 text-xs font-semibold tracking-[0.18em] uppercase">
            Learn, Play, Enjoy!
          </p>
          <h2 className="font-serif text-primary text-3xl font-semibold sm:text-4xl">
            Create your account
          </h2>
          <p className="text-neutral mt-2 text-sm">
            Fields marked <Required /> are required.
          </p>
        </header>

        <div className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Name
              <Required />
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input input-bordered bg-base-100 w-full"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
              <Required />
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input input-bordered bg-base-100 w-full"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium"
            >
              Password
              <Required />
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input input-bordered bg-base-100 w-full"
            />

            <label className="text-neutral mt-2.5 flex w-fit cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="checkbox checkbox-sm checkbox-primary"
              />
              Show password
            </label>
          </div>

          <div>
            <label
              htmlFor="usercategory"
              className="mb-1.5 block text-sm font-medium"
            >
              I am a
              <Required />
            </label>
            <select
              id="usercategory"
              value={usercategory}
              onChange={(e) => setUsercategory(e.target.value)}
              required
              className="select select-bordered bg-base-100 w-full"
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
        </div>

        <div className="border-base-300 mt-8 mb-5 flex items-center gap-3 border-t pt-6">
          <span className="text-neutral text-xs font-semibold tracking-[0.14em] uppercase">
            A little about you
          </span>
          <span className="text-neutral/70 text-xs">optional</span>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="level" className="mb-1.5 block text-sm font-medium">
              Level
            </label>
            <input
              id="level"
              type="text"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Beginner, intermediate, advanced"
              className="input input-bordered bg-base-100 w-full"
            />
          </div>

          <div>
            <label
              htmlFor="instrument"
              className="mb-1.5 block text-sm font-medium"
            >
              Instrument
            </label>
            <input
              id="instrument"
              type="text"
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              placeholder="Acoustic guitar"
              className="input input-bordered bg-base-100 w-full"
            />
          </div>

          <div>
            <label
              htmlFor="favband"
              className="mb-1.5 block text-sm font-medium"
            >
              Favorite band
            </label>
            <input
              id="favband"
              type="text"
              value={favband}
              onChange={(e) => setFavband(e.target.value)}
              placeholder="Who made you pick up a guitar?"
              className="input input-bordered bg-base-100 w-full"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-8 w-full">
          Create account
        </button>

        {error && (
          <div
            role="alert"
            className="bg-error/10 border-error/30 text-error rounded-field mb-6 border px-4 py-3 text-sm"
          >
            {error}
          </div>
        )}
        {success && (
          <div
            role="alert"
            className="bg-success/10 border-success/30 text-success rounded-field mb-6 border px-4 py-3 text-sm"
          >
            {success}
          </div>
        )}

        <p className="text-neutral mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link
            to="/login"
            className="link link-hover text-primary font-medium"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
