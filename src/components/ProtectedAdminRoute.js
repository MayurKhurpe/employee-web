// 📁 src/components/ProtectedAdminRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const location = useLocation();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }

  if (!user) {
    // ⛔ Not logged in
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== 'admin') {
    // ❌ Logged in but not admin
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authorized admin
  return children;
};

export default ProtectedAdminRoute;
