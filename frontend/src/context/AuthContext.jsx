import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pm_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('pm_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('pm_user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Auth session expired", err);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token, user_id, role, name } = res.data;
    localStorage.setItem('pm_token', access_token);

    const userObj = {
      id: user_id,
      email: email.toLowerCase(),
      role: role,
      name: name
    };
    setUser(userObj);
    localStorage.setItem('pm_user', JSON.stringify(userObj));

    try {
      const meRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      setUser(meRes.data);
      localStorage.setItem('pm_user', JSON.stringify(meRes.data));
      return meRes.data;
    } catch (e) {
      return userObj;
    }
  };

  const register = async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    const { access_token, user_id } = res.data;
    localStorage.setItem('pm_token', access_token);

    const userObj = {
      id: user_id,
      email: email.toLowerCase(),
      role: role,
      name: name
    };
    setUser(userObj);
    localStorage.setItem('pm_user', JSON.stringify(userObj));

    try {
      const meRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      setUser(meRes.data);
      localStorage.setItem('pm_user', JSON.stringify(meRes.data));
      return meRes.data;
    } catch (e) {
      return userObj;
    }
  };

  const logout = () => {
    localStorage.removeItem('pm_token');
    localStorage.removeItem('pm_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
