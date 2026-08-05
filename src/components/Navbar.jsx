import { useEffect } from 'react';
import { NavLink } from 'react-router';
import { useAuthenticationContext } from '../context/AuthenticationContext';


const Navbar = () => {
  const { token } = useAuthenticationContext();

  const { deleteToken } = useAuthenticationContext();

  const isAuthenticated = !!token;

  
  return (
    <div className="navbar bg-base-100 shadow-md rounded-box px-4">
      {/* Logo Placeholder */}
      <div className="navbar-start">
        
      </div>

      {/* Navigation */}
      <div className="navbar-end">
        <nav className="menu menu-horizontal items-center gap-2 p-2">
          <NavLink to="/" className="btn btn-ghost btn-sm">
            Home
          </NavLink>

          

          {!isAuthenticated ? (
            <NavLink to="/login" className="btn btn-ghost btn-sm">
              Login
            </NavLink>
          ) : (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                deleteToken();
                window.location.reload();
                window.location.href = '/';
              }}
            >
              Logout
            </button>
          )}

          {!isAuthenticated ? (
            <NavLink to="/signup" className="btn btn-primary btn-sm">
              Signup
            </NavLink>
          ) : null}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
