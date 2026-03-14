import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './Context/AuthContext';
import { CartProvider } from './Context/CartContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import LandingPage from './components/LandingPage';
import Navbar from './components/Common/Navbar';
import AdminDashboard from './components/Dashboard/AdminDashBoard';
import Reports from './components/Dashboard/Reports';
import POSInterface from './components/Orders/POSInterface';
import OrderQueue from './components/Orders/OrderQueue';
import MenuView from './components/Menu/MenuView';
import InventoryLogs from './components/Dashboard/InventoryLogs';
import './App.css';
import './index.css';
import CustomerOrders from './components/Customer/CustomerOrders';
import CashierDashboard from "./components/Dashboard/CashierDashboard";
import CustomerDashboard from "./components/Dashboard/CustomerDashboard";

// Create a separate component that uses the auth hook
function AppContent() {
  const { user } = useAuth(); // Get user from auth context

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                {user?.role === 'admin' && <AdminDashboard />}
                {user?.role === 'cashier' && <CashierDashboard />}
                {user?.role === 'customer' && <CustomerDashboard />}
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pos"
          element={
            <ProtectedRoute requiredRole="cashier">
              <>
                <Navbar />
                <POSInterface />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/queue"
          element={
            <ProtectedRoute requiredRole={['cashier', 'admin']}>
              <>
                <Navbar />
                <OrderQueue />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <MenuView />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute requiredRole="customer">
              <>
                <Navbar />
                <CustomerOrders />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute requiredRole="admin">
              <>
                <Navbar />
                <Reports />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory-logs"
          element={
            <ProtectedRoute requiredRole="admin">
              <>
                <Navbar />
                <InventoryLogs />
              </>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// Main App component with providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent /> {/* This component has access to auth context */}
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;