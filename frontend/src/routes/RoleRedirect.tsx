import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const RoleRedirect: React.FC = () => {
  const { user } = useAuth();

  console.log('RoleRedirect - User:', user);

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('User role:', user.role);

  switch (user.role) {
    case UserRole.ADMIN:
      console.log('Redirecting to admin dashboard');
      return <Navigate to="/dashboard/admin" replace />;
    case UserRole.STORE_OWNER:
      console.log('Redirecting to owner dashboard');
      return <Navigate to="/dashboard/owner" replace />;
    case UserRole.USER:
      console.log('Redirecting to user dashboard');
      return <Navigate to="/dashboard/user" replace />;
    default:
      console.log('Unknown role, redirecting to login');
      return <Navigate to="/login" replace />;
  }
};
