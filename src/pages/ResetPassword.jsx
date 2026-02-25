import React, { useState } from "react";
import api from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ResetPassword.css"; // Custom CSS

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleReset = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      toast.error("All fields are required");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must be at least 8 chars, include 1 uppercase, 1 number & 1 special character"
      );
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/password/reset", { email, otp, newPassword });
      toast.success("Password reset successful 🎉");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <h4 className="text-center mt-5">Invalid request</h4>;
  }

  return (
    <div className="reset-password-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="reset-card shadow-lg">
        <div className="reset-card-header text-center">
          <h3>Reset Password 🔑</h3>
          <p>Enter OTP and your new password</p>
        </div>

        <form className="reset-form" onSubmit={handleReset}>
          <div className="form-group">
            <label>OTP</label>
            <input
              className="form-control input-field"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              className="form-control input-field"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Strong password"
              required
            />
            <small className="text-muted">
              Must include uppercase, number & special character
            </small>
          </div>

          <button
            className="btn btn-orange btn-block"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
