import { NavLink, useNavigate } from 'react-router';
import { useAuthenticationContext } from '../context/AuthenticationContext';

const Navbar = () => {
  const { user, logout } = useAuthenticationContext();
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  // logout() clears the user, which re-renders this navbar. No reload needed.
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // active link styling, shared by desktop + mobile
  const linkClass = ({ isActive }) =>
    `btn btn-ghost btn-sm ${isActive ? 'text-primary font-semibold' : ''}`;

  return (
    <div className="navbar bg-base-100 border-accent/30 sticky top-0 z-50 border-b-2 px-4">
      {/* Brand */}
      <div className="navbar-start">
        <NavLink
          to={isAuthenticated ? '/home' : '/'}
          className="btn btn-ghost gap-1 px-2 text-xl font-bold"
        >
          <span className="text-primary">Learn,</span>
          <span className="text-secondary">Play,</span>
          <span className="text-accent">Enjoy!</span>
        </NavLink>
      </div>

      {/* Desktop nav */}
      <div className="navbar-end hidden sm:flex">
        <nav className="menu menu-horizontal items-center gap-2 p-2">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="btn btn-sm bg-highlight text-highlight-content border-highlight hover:brightness-95"
              >
                Signup
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/home" className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/stems" className={linkClass}>
                StemAnalyzer
              </NavLink>
              <NavLink to="/recording" className={linkClass}>
                Recordings
              </NavLink>
              <button
                className="btn btn-outline btn-sm border-secondary text-secondary hover:bg-secondary hover:text-secondary-content"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      <div className="navbar-end sm:hidden">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-200 rounded-box z-50 mt-3 w-52 gap-1 p-2 shadow-lg"
          >
            {!isAuthenticated ? (
              <>
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li>
                  <NavLink
                    to="/signup"
                    className="text-highlight font-semibold"
                  >
                    Signup
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/home">Home</NavLink>
                </li>
                <li>
                  <NavLink to="/stems">StemAnalyzer</NavLink>
                </li>
                <li>
                  <NavLink to="/recording">Recordings</NavLink>
                </li>
                
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
