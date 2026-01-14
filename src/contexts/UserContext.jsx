import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userName, setUserName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const register = (name) => {
    setUserName(name);
    setIsRegistered(true);
  };

  const logout = () => {
    setUserName('');
    setIsRegistered(false);
  };

  return (
    <UserContext.Provider value={{ userName, isRegistered, register, logout, editMode, setEditMode }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}