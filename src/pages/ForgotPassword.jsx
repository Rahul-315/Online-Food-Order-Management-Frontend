import React, { useState } from "react";
import api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css"; // We'll add custom CSS here

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/password/forgot", { email });
      toast.success("OTP sent to your email");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <ToastContainer />
      <div className="forgot-card shadow-lg">
        <div className="forgot-card-header text-center">
          <h3>Forgot Password 🔐</h3>
          <p>Enter your email to receive a one-time password (OTP)</p>
        </div>

        <form className="forgot-form" onSubmit={handleSendOtp}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control input-email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            className="btn btn-orange btn-block"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
