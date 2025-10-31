import React, { createContext, useContext, useState } from 'react';
import { APP_CONFIG } from '../config/constants';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user] = useState({
    login: APP_CONFIG.CURRENT_USER,
    lastActive: APP_CONFIG.CURRENT_UTC
  });

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);