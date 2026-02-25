import React, { useState } from "react";
import api from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/password/reset", {
        email,
        otp,
        newPassword,
      });
      toast.success("Password reset successful");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <h4 className="text-center mt-5">Invalid request</h4>;
  }

  return (
    <div className="container" style={{ paddingTop: "120px" }}>
      <ToastContainer />
      <div className="card mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h4 className="text-center mb-3">Reset Password 🔑</h4>

          <form onSubmit={handleReset}>
            <div className="mb-3">
              <label>OTP</label>
              <input
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-success w-100" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
