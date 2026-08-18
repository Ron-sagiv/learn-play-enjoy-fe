import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Navigate } from "react-router";
import  {useAuthenticationContext}  from '../context/AuthenticationContext';

const USER_STORAGE_KEY = 'lpe_user';
const LoginForm = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [authenticated,setAuthenticated]=useState(false);
  const  {addUser}  = useAuthenticationContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      /* --- Local storage -------------------------------------------------
         Keep a local copy of the user so the app still knows who is signed
         in after a page refresh. The backend stays the source of truth,
         this is only a cache.

         - Written under USER_STORAGE_KEY, the same key the signup page
           uses, so login just overwrites what signup left behind and the
           two pages never drift apart.
         - Stored as a JSON string, because localStorage holds strings only.
         - `data.user ?? data` covers both response shapes: a backend that
           wraps the user under a `user` key, and one that returns the user
           object at the top level.
         - The password is never stored. Only what the backend sent back.
         - The token is kept separately, it is what the backend wants on
           later requests.
         - Sign out removes both keys, see the note under the component.
      ------------------------------------------------------------------- */
          addUser(data.user);

          setAuthenticated(true);
          setForm(initialState);
    } catch (err) {
      setError(err.message);
    }
  };

if(authenticated){
  return <Navigate to="/home" />;
}

  return (
    <div className="bg-base-100 text-base-content min-h-screen px-4 py-10 sm:px-6 sm:py-16">
      <form
        onSubmit={handleLogin}
        className="bg-base-200 border-base-300 rounded-box mx-auto w-full max-w-md border p-6 shadow-sm sm:p-8"
      >
        <header className="mb-8">
          <p className="text-secondary mb-2 text-xs font-semibold tracking-[0.18em] uppercase">
            Learn, Play, Enjoy!
          </p>
          <h2 className="font-serif text-primary text-3xl font-semibold sm:text-4xl">
            Welcome back
          </h2>
          <p className="text-neutral mt-2 text-sm">
            Log in to pick up where you left off.
          </p>
        </header>

        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="input input-bordered bg-base-100 w-full"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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
        </div>

        <button type="submit" className="btn btn-primary mt-8 w-full">
          Log in
        </button>

        {error && (
          <div
            role="alert"
            className="bg-error/10 border-error/30 text-error rounded-field mt-6 border px-4 py-3 text-sm"
          >
            {error}
          </div>
        )}

        <p className="text-neutral mt-6 text-center text-sm">
          New here?{' '}
          <Link
            to="/signup"
            className="link link-hover text-primary font-medium"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
/* --- Signing out -----------------------------------------------------
   Wherever your sign-out button lives:

     import { USER_STORAGE_KEY } from '../pages/SignUpPage';

     const handleSignOut = () => {
       localStorage.removeItem(USER_STORAGE_KEY);
       localStorage.removeItem('token');
       navigate('/login');
     };
--------------------------------------------------------------------- */
