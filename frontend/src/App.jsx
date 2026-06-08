import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Customers from './pages/Customers';
import Promotions from './pages/Promotions';
import PromotionVehicles from './pages/PromotionVehicles';
import Reports from './pages/Reports';
import Users from './pages/Users';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading PMS System...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/logout" element={<Logout />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/promotion-vehicles" element={<PromotionVehicles />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
