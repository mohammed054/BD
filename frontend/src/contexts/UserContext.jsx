import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userName, setUserName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('bd-username');
    if (savedName) {
      setUserName(savedName);
      setIsRegistered(true);
    }
  }, []);

  const register = (name) => {
    setUserName(name);
    setIsRegistered(true);
    localStorage.setItem('bd-username', name);
  };

  return (
    <UserContext.Provider value={{ userName, isRegistered, register }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}