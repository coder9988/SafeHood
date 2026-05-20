import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    async function refreshUser() {
      const token = localStorage.getItem('token');

      if (!token) return;

      try {
        const { data } = await api.get('/me');
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      } catch {
        localStorage.clear();
        setUser(null);
      }
    }

    refreshUser();
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(form) {
    const { data } = await api.post('/register', form);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function logout() {
    try {
      await api.post('/logout');
    } catch {
      // The local session should still be cleared if the token is already invalid.
    }

    localStorage.clear();
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
