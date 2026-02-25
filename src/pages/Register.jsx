import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { OverlayTrigger, Tooltip, InputGroup, FormControl } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css"; // ✅ import new CSS

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const mobileRegex = /^[7-9][0-9]{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const addressMinLength = 10;

  const evaluatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/\d/.test(pwd)) strength += 1;
    if (/[@$!%*?&]/.test(pwd)) strength += 1;
    setPasswordStrength(strength);
  };

  const handleChange = (setter) => (e) => setter(e.target.value);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    evaluatePasswordStrength(value);
  };

  const validateField = {
    username: () => username.trim().length >= 3,
    email: () => emailRegex.test(email),
    mobile: () => mobileRegex.test(mobileNumber),
    password: () => passwordRegex.test(password),
    confirmPassword: () =>
      password === confirmPassword && confirmPassword !== "",
    address: () => address.trim().length >= addressMinLength,
  };

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
      case 3:
        return "Medium";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-danger";
      case 2:
      case 3:
        return "bg-warning";
      case 4:
        return "bg-success";
      default:
        return "";
    }
  };

  const passwordTooltip = (
    <Tooltip id="password-tooltip">
      Password must:
      <ul className="mb-0">
        <li>Be at least 8 characters</li>
        <li>Include at least 1 uppercase letter</li>
        <li>Include at least 1 number</li>
        <li>Include at least 1 special character (@$!%*?&)</li>
      </ul>
    </Tooltip>
  );

  const mobileTooltip = (
    <Tooltip id="mobile-tooltip">
      Mobile number must:
      <ul className="mb-0">
        <li>Start with 7, 8, or 9</li>
        <li>Be exactly 10 digits</li>
      </ul>
    </Tooltip>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validateField.username() ||
      !validateField.email() ||
      !validateField.mobile() ||
      !validateField.password() ||
      !validateField.confirmPassword() ||
      !validateField.address()
    ) {
      toast.error("Please fix validation errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
        confirmPassword,
        mobileNumber,
        address,
      });

      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="register-card">
        <div className="card-body p-4">
          <h3 className="text-center fw-bold mb-3">Create Account 🚀</h3>
          <p className="text-center text-muted mb-4">
            Join QuickBite and start ordering
          </p>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-3">
              <label className="form-label">Username *</label>
              <FormControl
                placeholder="Enter your username"
                value={username}
                onChange={handleChange(setUsername)}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email *</label>
              <FormControl
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange(setEmail)}
                required
              />
            </div>

            {/* Mobile */}
            <div className="mb-3">
              <label className="form-label">Mobile Number *</label>
              <OverlayTrigger placement="right" overlay={mobileTooltip}>
                <FormControl
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={mobileNumber}
                  onChange={handleChange(setMobileNumber)}
                  required
                />
              </OverlayTrigger>
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label">Address *</label>
              <FormControl
                as="textarea"
                rows={2}
                placeholder="Enter your full address"
                value={address}
                onChange={handleChange(setAddress)}
                required
              />
              {address && address.length < addressMinLength && (
                <small className="text-danger">
                  Address must be at least 10 characters
                </small>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password *</label>
              <OverlayTrigger placement="right" overlay={passwordTooltip}>
                <InputGroup>
                  <FormControl
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 chars, 1 uppercase, 1 number, 1 special char"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <InputGroup.Text
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </InputGroup.Text>
                </InputGroup>
              </OverlayTrigger>

              {password && (
                <div className="mt-1">
                  <div className="progress" style={{ height: "5px" }}>
                    <div
                      className={`progress-bar ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    />
                  </div>
                  <small>Password strength: {getStrengthLabel()}</small>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label">Confirm Password *</label>
              <InputGroup>
                <FormControl
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={handleChange(setConfirmPassword)}
                  required
                />
                <InputGroup.Text
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroup.Text>
              </InputGroup>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="text-center mt-3">
            <span className="text-muted">Already have an account?</span>{" "}
            <Link to="/login" className="fw-semibold">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
