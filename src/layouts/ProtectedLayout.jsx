import { Navigate, Outlet, } from 'react-router';
import  {useAuthenticationContext}  from '../context/AuthenticationContext';
const ProtectedLayout = () => {
  const  {user}  = useAuthenticationContext();
  const isAuthenticated = !!user;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedLayout;