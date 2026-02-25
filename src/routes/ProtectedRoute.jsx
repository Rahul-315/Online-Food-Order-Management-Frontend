import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getRole } from "../auth/auth";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  // 🔐 Not logged in → go to login, remember where user came from
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  const role = getRole();

  // 🚫 Logged in but role not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    switch (role) {
      case "ADMIN":
        return <Navigate to="/admin" replace />;
      case "RESTAURANT_STAFF":
        return <Navigate to="/staff/dashboard" replace />;
      case "CUSTOMER":
        return <Navigate to="/customer/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // ✅ Authorized
  return children;
};

export default ProtectedRoute;
