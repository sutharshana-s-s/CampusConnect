import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Clubs from './pages/Clubs';
import ClubManagement from './pages/ClubManagement';
import ViewClub from './pages/ViewClub';
import Canteen from './pages/Canteen';
import CanteenOrders from './pages/CanteenOrders';
import CanteenManagement from './pages/CanteenManagement';
import OrderTracking from './pages/OrderTracking';
import Hostel from './pages/Hostel';
import Marketplace from './pages/Marketplace';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import { checkSession } from './store/slices/authSlice';
import type { RootState, AppDispatch } from './store/store';
import './index.css';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check session on app load
    dispatch(checkSession());
  }, [dispatch]);

  // Only show loading if we're actually checking auth and have no user
  if (loading && !user) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '1.125rem',
        color: '#64748b'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
            {user ? (
              <Route path="/*" element={<Layout />}>
                {/* Basic Routes - Accessible to all authenticated users */}
                <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                <Route path="clubs" element={<ProtectedRoute><Clubs /></ProtectedRoute>} />
                <Route path="canteen" element={<ProtectedRoute><Canteen /></ProtectedRoute>} />
                <Route path="order-tracking" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
                <Route path="hostel" element={<ProtectedRoute><Hostel /></ProtectedRoute>} />
                <Route path="messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                
                {/* Club Manager Routes */}
                <Route path="club-management" element={<ProtectedRoute requiredFeature="club_management"><ClubManagement /></ProtectedRoute>} />
                <Route path="view-club/:clubId" element={<ProtectedRoute><ViewClub /></ProtectedRoute>} />
                
                {/* Canteen Vendor Routes */}
                <Route path="canteen-orders" element={<ProtectedRoute requiredFeature="canteen_orders"><CanteenOrders /></ProtectedRoute>} />
                <Route path="canteen-management" element={<ProtectedRoute requiredFeature="canteen_management"><CanteenManagement /></ProtectedRoute>} />
                
                {/* Hostel Admin Routes */}
                <Route path="hostel-complaints" element={<ProtectedRoute requiredFeature="hostel_complaints"><Hostel /></ProtectedRoute>} />
                
                {/* Super Admin Routes */}
                <Route path="user-management" element={<ProtectedRoute requiredFeature="user_management"><Settings /></ProtectedRoute>} />
                <Route path="system-settings" element={<ProtectedRoute requiredFeature="system_settings"><Settings /></ProtectedRoute>} />
              </Route>
            ) : (
              <Route path="*" element={<Navigate to="/auth" />} />
            )}
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;