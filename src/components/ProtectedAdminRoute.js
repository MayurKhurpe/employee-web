// 📁 src/components/ProtectedAdminRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  if (!user) {
    // Not logged in — redirect to login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== 'admin') {
    // Logged in but not admin — redirect to dashboard or unauthorized page
    return <Navigate to="/dashboard" replace />;
  }

  // Logged in and admin — render children
  return children;
};

export default ProtectedAdminRoute;
