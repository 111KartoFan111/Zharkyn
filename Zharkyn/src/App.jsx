// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Main from './components/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CarDetails from './pages/CarDetails';
import AdminPanel from './pages/AdminPanel';
import AddListing from './pages/AddListing';
import SearchResults from './pages/SearchResults';
import BlogList from './pages/BlogList.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import CreateBlog from './pages/CreateBlog.jsx';
import MyBlogs from './pages/MyBlogs.jsx';
import EditBlog from './pages/EditBlog.jsx';
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
        
        {/* Car related routes */}
        <Route path="/car/:id" element={<CarDetails user={user} onLogout={logout} />} />
        <Route path="/search" element={<SearchResults user={user} onLogout={logout} />} />
        
        {/* Authentication routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/profile" /> : <Login onLogin={login} />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" /> : <Register />
        } />
        
        {/* User profile and listings routes */}
        <Route path="/profile" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile user={user} onLogout={logout} />
          </ProtectedRoute>
        } />
        <Route path="/add-listing" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AddListing user={user} onLogout={logout} />
          </ProtectedRoute>
        } />
        
        {/* Blog routes */}
        <Route path="/blogs" element={<BlogList user={user} onLogout={logout} />} />
        <Route path="/blog/:id" element={<BlogDetail user={user} onLogout={logout} />} />
        <Route path="/my-blogs" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MyBlogs user={user} onLogout={logout} />
          </ProtectedRoute>
        } />
        <Route path="/create-blog" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreateBlog user={user} onLogout={logout} />
          </ProtectedRoute>
        } />
        <Route path="/edit-blog/:id" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditBlog user={user} onLogout={logout} />
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="admin" user={user}>
            <AdminPanel user={user} onLogout={logout} />
          </ProtectedRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;