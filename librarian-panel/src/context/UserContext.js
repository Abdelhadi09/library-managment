import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? { token } : null; // Initialize user state from localStorage if a token exists
  });

  const logout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    setUser(null); // Reset user state
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
