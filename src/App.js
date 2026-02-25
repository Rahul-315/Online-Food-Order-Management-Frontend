import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./dashboard/AdminDashboard";
import StaffDashboard from "./dashboard/StaffDashboard";
import CustomerDashboard from "./dashboard/CustomerDashboard";
import Careers from "./components/customer/Careers";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import QuickBiteOne from "./components/customer/QuickBiteOne";
import Instamart from "./components/customer/Instamart";
import Partner from "./components/customer/Partner";
import Delivery from "./components/customer/Delivery";
import HelpSupport from "./components/customer/HelpSupport";
import PartnerRegister from "./components/customer/PartnerRegister";

function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isStaffRoute = location.pathname.startsWith("/staff");
  const isCustomerRoute = location.pathname.startsWith("/customer");

  return (
    <>
       {/* ✅ Toast container (REQUIRED) */}
      <ToastContainer position="top-right" autoClose={3000} />
      {!isAdminRoute && !isStaffRoute && !isCustomerRoute && <Navbar />}

      <Routes>
        {/* ✅ LANDING PAGE → Customer Dashboard (Guest Mode) */}
        <Route path="/" element={<CustomerDashboard guestMode />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        {/* Footer / Public Pages */}
        <Route path="/careers" element={<Careers />} />
        <Route path="/Quick" element={<QuickBiteOne />} />
        <Route path="/instamart" element={<Instamart />} />
        <Route path="/partner" element={<Partner/>} />
        <Route path="/delivery" element={<Delivery/>} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="/partner-register" element={<PartnerRegister />} />

        {/* Forgot Password (Public) */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Staff */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANT_STAFF"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* Customer (Logged-in Only) */}
        <Route
          path="/customer/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
              
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </>
  );
}

export default App;
