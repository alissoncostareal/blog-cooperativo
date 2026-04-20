'use client';

import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null
  );

  function login(newToken) {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('access_token');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}