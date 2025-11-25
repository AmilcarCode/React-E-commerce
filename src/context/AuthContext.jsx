import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS } from '../utils/constants';
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { isAuth: storedAuth, user: storedUser } = getAuthFromStorage();
    setIsAuth(storedAuth);
    setUser(storedUser);
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const foundUser = USERS.find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      const userInfo = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        role: foundUser.role
      };
      setIsAuth(true);
      setUser(userInfo);
      saveAuthToStorage(true, userInfo);
      return { success: true, user: userInfo };
    }
    return { success: false, error: 'Credenciales incorrectas' };
  };

  const logout = () => {
    setIsAuth(false);
    setUser(null);
    saveAuthToStorage(false, null);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    isAuth,
    user,
    userName: user?.name || '',
    loading,
    login,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};