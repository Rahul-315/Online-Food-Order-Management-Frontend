import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/api";
import { ROLES } from "../utils/constants";
import { InputGroup, FormControl } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import Footer from "../components/customer/Footer";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const usernameRegex = /^.{3,20}$/;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!usernameRegex.test(username.trim())) {
      toast.error("Username must be 3–20 characters");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const token = response.data;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role === ROLES.ADMIN) navigate("/admin");
      else if (role === ROLES.STAFF) navigate("/staff/dashboard");
      else if (role === ROLES.CUSTOMER) navigate("/customer/dashboard");
      else navigate("/login");

    } catch (err) {
      toast.error(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="login-card">
        <div className="brand text-center mb-3">
          <h2>Welcome Back</h2>
        </div>

        <h4 className="text-center mb-4">Login</h4>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <FormControl
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <InputGroup>
              <FormControl
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputGroup.Text
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroup.Text>
            </InputGroup>
          </div>

          <button
            type="submit"
            className="btn btn-login w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center mt-3">
           <p className="text-muted">Or login with Google</p>
          <GoogleLogin
           onSuccess={async (credentialResponse) => {
           const idToken = credentialResponse.credential;
           try {
           const response = await api.post("/auth/google", { idToken });
           const token = response.data;
           localStorage.setItem("token", token);

           const decoded = jwtDecode(token);
           const role = decoded.role;

           if (role === "ADMIN") navigate("/admin");
            else if (role === "RESTAURANT_STAFF") navigate("/staff/dashboard");
           else if (role === "CUSTOMER") navigate("/customer/dashboard");
            else navigate("/login");

           } catch (err) {
           toast.error("Google login failed");
           }
           }}
             onError={() => toast.error("Google login failed")}
       
           />
           </div>
          </form>

        <div className="text-center mt-3">
          <Link to="/forgot-password" className="link-soft">
            Forgot Password?
          </Link>
        </div>

        <div className="text-center mt-3">
          <span className="text-muted">New here? </span>
          <Link to="/register" className="link-strong">
            Create an account 🚀
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
