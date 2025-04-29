import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated, requiredRole, user }) => {
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If a specific role is required and user doesn't have it, redirect to home
  // This will be used for admin routes
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  // Otherwise, render the protected component
  return children;
};

export default ProtectedRoute;