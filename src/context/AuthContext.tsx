import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('auth_token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('🔐 Attempting login...');
      
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // Validasi role untuk admin login
        if (window.location.pathname === '/f1/f2/mlebu/masuk' && userData.role !== 'admin') {
          console.error('Access denied: Not an admin user');
          return false;
        }
        
        // Validasi role untuk customer login
        if (window.location.pathname === '/login' && userData.role !== 'customer') {
          console.error('Customer login only');
          return false;
        }
        
        console.log('✅ Login successful:', userData.name, `(${userData.role})`);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('auth_token', token);
        
        return true;
      } else {
        console.error('Login failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('👤 Attempting registration...');
      
      const response = await apiService.register({
        ...userData,
        password,
      });
      
      if (response.success && response.data) {
        const { user: newUser, token } = response.data;
        
        console.log('✅ Registration successful:', newUser.name);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('auth_token', token);
        
        return true;
      } else {
        console.error('Registration failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      console.log('✅ Logout successful');
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};