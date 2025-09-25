import { Route, Routes, Navigate } from "react-router-dom";
import Doctor from "./pages/doctor";
import Reception from "./pages/reception";
import Dashboard from "./pages/dashboard";
import Doctors from "./components/admin-pages/doctors";
import Settings from "./components/admin-pages/settings";
import Auth from "./pages/auth";
import ChangePassword from "./components/admin-pages/change-password";
import User from "./components/admin-pages/user";
import { useAuthStore } from "./store/auth-store";
import { ProtectedRoute } from "./components/route/protectRoute";
import MiniDrawer from "./components/shared/sidebar";

const App = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />
        } 
      />
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />

      {/* Protected routes with role-based access */}
      <Route 
        path="/doctor" 
        element={
          <ProtectedRoute requiredRole="doctor">
            <Doctor />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/reception" 
        element={
          <ProtectedRoute requiredRole="reception">
            <Reception />
          </ProtectedRoute>
        } 
      />

      {/* Admin routes with sidebar layout */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requiredRole="admin">
            <MiniDrawer>
              <Dashboard />
            </MiniDrawer>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin-profile" 
        element={
          <ProtectedRoute requiredRole="admin">
            <MiniDrawer>
              <ChangePassword />
            </MiniDrawer>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/add-user" 
        element={
          <ProtectedRoute requiredRole="admin">
            <MiniDrawer>
              <User />
            </MiniDrawer>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/doctors" 
        element={
          <ProtectedRoute requiredRole="admin">
            <MiniDrawer>
              <Doctors />
            </MiniDrawer>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/receptions" 
        element={
          <ProtectedRoute requiredRole="admin">
            <MiniDrawer>
              <Reception />
            </MiniDrawer>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute requiredRole="admin">
            <MiniDrawer>
              <Settings />
            </MiniDrawer>
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;