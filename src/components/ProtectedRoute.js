// 📁 src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
