import React, { createContext, useContext, useState, useEffect } from 'react';
import { TEST_USER } from '../utils/constants';
import { getAuthFromStorage, saveAuthToStorage } from '../utils/helpers';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { isAuth: storedAuth, userName: storedUserName } = getAuthFromStorage();
    setIsAuth(storedAuth);
    setUserName(storedUserName);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email === TEST_USER.email && password === TEST_USER.password) {
      setIsAuth(true);
      setUserName(TEST_USER.name);
      saveAuthToStorage(true, TEST_USER.name);
      return { success: true };
    }
    return { success: false, error: 'Credenciales incorrectas' };
  };

  const logout = () => {
    setIsAuth(false);
    setUserName('');
    saveAuthToStorage(false, '');
  };

  const value = {
    isAuth,
    userName,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};