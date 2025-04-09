import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Auth/Login';
import Register from './components/Auth/Register';
import { Navbar } from './components/Navbar';
import FormList from './components/FormList';
import FormEditor from './components/FormEditor';
import FormPreview from './components/FormPreview';
import LanguageSwitcher from './components/LanguageSwitcher';
import { ApiTest } from './components/ApiTest';
import './i18n/config';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/test" element={<ApiTest />} />
              <Route
                path="/forms"
                element={
                  <PrivateRoute>
                    <FormList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/forms/new"
                element={
                  <PrivateRoute>
                    <FormEditor />
                  </PrivateRoute>
                }
              />
              <Route
                path="/forms/:id/edit"
                element={
                  <PrivateRoute>
                    <FormEditor />
                  </PrivateRoute>
                }
              />
              <Route
                path="/forms/:id/preview"
                element={
                  <PrivateRoute>
                    <FormPreview form={{ id: 0, title: '', description: '', fields: [], is_published: false }} />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/forms" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App; 