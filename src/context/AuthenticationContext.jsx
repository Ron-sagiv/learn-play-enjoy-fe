import { createContext , useState, useContext} from "react";

const AuthenticationContext= createContext();

export default function AuthenticationProvider({ children }) {
  const tokenEntry = JSON.parse(localStorage.getItem('token')) || '';
  //const [entrys, setEntrys] = useState(allEntrys);
  const[token, setToken] = useState(tokenEntry);

  const addToken = (tokenEntry) => {
    
     // const updatedEntrys = [tokenEntry,...entrys];
      localStorage.setItem('token', JSON.stringify(tokenEntry));
      //setEntrys(JSON.parse(localStorage.getItem('allentrys')) || []);
    setToken(getToken());
  };

  const deleteToken = () => {
    
      localStorage.setItem('token', JSON.stringify(''));
      //setEntrys(JSON.parse(localStorage.getItem('allentrys')) || []);
    setToken(getToken());
  };

  const getToken = () => {
    return JSON.parse(localStorage.getItem('token')) || '';
  };

  return (
    <AuthenticationContext.Provider value={{token, addToken, deleteToken}}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthenticationContext() {
  return useContext(AuthenticationContext);
}