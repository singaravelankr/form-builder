import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.AUTH.USER}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data) {
            setUser(response.data);
          } else {
            throw new Error('Invalid user data');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          // Handle validation errors
          const validationErrors = error.response.data.errors;
          if (validationErrors?.email) {
            setError(validationErrors.email[0]);
          } else if (validationErrors?.password) {
            setError(validationErrors.password[0]);
          } else {
            setError('Invalid email or password');
          }
        } else if (error.response?.status === 401) {
          setError('Invalid email or password');
        } else if (error.response?.status === 404) {
          setError('User not found');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`, {
        name,
        email,
        password,
        password_confirmation,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error) {
      console.error('Registration failed:', error);
      
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const responseData = error.response.data;
        console.log('Error response data:', responseData); // Debug log
        
        // Handle Laravel validation errors
        if (responseData.errors) {
          // Check for email uniqueness error
          if (responseData.errors.email && responseData.errors.email[0] === 'The email has already been taken.') {
            setError('This email is already registered. Please use a different email or try logging in.');
          }
          // Check for password confirmation error
          else if (responseData.errors.password_confirmation) {
            setError('Passwords do not match. Please try again.');
          }
          // Check for password length error
          else if (responseData.errors.password && responseData.errors.password[0].includes('must be at least')) {
            setError('Password must be at least 8 characters long.');
          }
          // For other validation errors, show the first error message
          else {
            const firstError = Object.values(responseData.errors).flat()[0];
            if (typeof firstError === 'string') {
              setError(firstError);
            } else {
              setError('Registration failed. Please check your input.');
            }
          }
        } else if (responseData.message) {
          // If there's a direct message, use it
          setError(responseData.message);
        } else {
          setError('Registration failed. Please check your input.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setError('An unexpected error occurred during logout.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 