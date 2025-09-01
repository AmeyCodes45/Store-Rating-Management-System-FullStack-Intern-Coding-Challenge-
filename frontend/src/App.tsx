import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRedirect } from './routes/RoleRedirect';
import Login from './auth/Login';
import Signup from './auth/Signup';
import AdminDashboard from './dashboard/admin/AdminDashboard';
import OwnerDashboard from './dashboard/owner/OwnerDashboard';
import UserDashboard from './dashboard/user/UserDashboard';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route index element={<RoleRedirect />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="owner" element={<OwnerDashboard />} />
            <Route path="user" element={<UserDashboard />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
