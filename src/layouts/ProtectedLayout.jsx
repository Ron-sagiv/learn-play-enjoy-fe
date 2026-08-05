import { Navigate, Outlet, } from 'react-router';
import  {useAuthenticationContext}  from '../context/AuthenticationContext';
const ProtectedLayout = () => {
  const { token } = useAuthenticationContext();
  const isAuthenticated = !!token;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedLayout;