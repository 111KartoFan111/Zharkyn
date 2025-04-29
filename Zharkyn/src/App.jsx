// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Main from './components/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CarDetails from './pages/CarDetails';
import AdminPanel from './pages/AdminPanel';
import SearchResults from './pages/SearchResults';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for token in localStorage and validate with backend
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Get user data from backend
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    
    validateToken();
  }, []);
  
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return <div className="loading-container">Загрузка...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main user={user} onLogout={logout} />} />
        <Route path="/car/:id" element={<CarDetails user={user} />} />
        <Route path="/search" element={<SearchResults user={user} onLogout={logout} />} />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <Login onLogin={login} />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" /> : <Register />
        } />
        <Route path="/profile" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile user={user} onLogout={logout} />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="admin">
            <AdminPanel user={user} onLogout={logout} />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;