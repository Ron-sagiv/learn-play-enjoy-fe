import { createContext , useState, useContext} from "react";

const AuthenticationContext= createContext();
const USER_STORAGE_KEY = 'lpe_user';

export default function AuthenticationProvider({ children }) {
  const userEntry = JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || '';
  const[user, setUser] = useState(userEntry);
  
  const addUser = (user) => {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    setUser(getUser());
  };

  const logout = () => {
    
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(''));
    setUser(getUser());
  };

  const getUser = () => {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || '';
  };

  return (
    <AuthenticationContext.Provider value={{addUser, user,logout}}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthenticationContext() {
  return useContext(AuthenticationContext);
}