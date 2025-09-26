import { Navigate, Route, Routes } from "react-router-dom";
import Doctor from "./pages/doctor";
import Reception from "./pages/reception";
import Dashboard from "./pages/dashboard";
import MiniDrawer from "./components/shared/sidebar";
import Doctors from "./components/admin-pages/doctors";
import Settings from "./components/admin-pages/settings";
import Auth from "./pages/auth";
import ChangePassword from "./components/admin-pages/change-password";
import User from "./components/admin-pages/user";
import { ProtectedRoute } from "./components/route/protectRoute";
import { useAuthStore } from "./store/auth-store";

const App = () => {
  const { isAuthenticated, user } = useAuthStore();
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

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
     

        <Route element={<MiniDrawer />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-profile" element={<ChangePassword />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/receptions" element={<Reception />} />
          <Route path="/add-user" element={<User />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
