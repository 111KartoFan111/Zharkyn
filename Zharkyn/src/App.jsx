import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Main from './components/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CarDetails from './pages/CarDetails';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token with backend (this will be implemented later)
      setIsAuthenticated(true);
      // Get user data (placeholder for now)
      setUser({ username: 'user', role: 'user' });
    }
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main user={user} />} />
        <Route path="/car/:id" element={<CarDetails />} />
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
            <AdminPanel user={user} />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;