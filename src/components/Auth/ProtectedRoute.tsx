import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { canAccessFeature } from '../../utils/rolePermissions';
import type { RootState } from '../../store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredFeature?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  requiredFeature 
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user has required role (if specified)
  const hasRequiredRole = !requiredRole || user.role === requiredRole;
  
  // Check if user has required feature (if specified)
  const hasRequiredFeature = !requiredFeature || canAccessFeature(user.role, requiredFeature);

  // If user doesn't have required role or feature, redirect to dashboard
  if (!hasRequiredRole || !hasRequiredFeature) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 