import React from "react";
import { Route, Routes } from "react-router-dom";
import Doctor from "./pages/doctor";
import Auth from "./pages/auth";
import Reception from "./pages/reception";
import Dashboard from "./pages/dashboard";
import MiniDrawer from "./components/shared/sidebar";
import Doctors from "./components/admin-pages/doctors";
import AdminProfile from "./components/admin-pages/admin-profile";
import Patients from "./components/admin-pages/patients";
import Settings from "./components/admin-pages/settings";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/doctor" element={<Doctor />} />
      <Route path="/reception" element={<Reception />} />

      <Route element={<MiniDrawer />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/receptions" element={<Reception />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default App;
