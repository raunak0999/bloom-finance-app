import React, { createContext, useState, useCallback } from 'react';
import { authAPI } from '../services/api';


interface User {
  id: string;
  email: string;
  fullName: string;
  country?: string;
}


interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, country: string) => Promise<void>;
  logout: () => void;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      const token = response.data.token;
      const userData = response.data.user;
      
      setToken(token);
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.id) {
        localStorage.setItem('userId', userData.id);
      }
      console.log('✅ Token saved:', token);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);


  const register = useCallback(async (fullName: string, email: string, password: string, country: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(fullName, email, password, country);
      const token = response.data.token;
      const userData = { ...response.data.user, country };

      setToken(token);
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.id) {
        localStorage.setItem('userId', userData.id);
      }
      console.log('✅ Token saved:', token);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);


  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  }, []);


  return (
    <AuthContext.Provider value={{ user, token, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
