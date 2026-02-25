import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout, getUsername } from "../auth/auth";
import "../styles/navbar.css";
import quickBiteLogo from "../assets/images/quickbite.png";

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const username = getUsername();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      {/* ✅ LOGO LEFT FIXED */}
      <div className="brand">
        <img src={quickBiteLogo} alt="QuickBite" />
      </div>

      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
  <li className="nav-item">
    <Link className="nav-link" to="/">Home</Link>
  </li>

  <li className="nav-item">
    <Link className="nav-link" to="/about">About Us</Link>
  </li>

  <li className="nav-item">
    <Link className="nav-link qb-link" to="/careers">Careers</Link>
  </li>

  <li className="nav-item">
    <Link className="nav-link qb-link" to="/quick">QuickBite One</Link>
  </li>

  <li className="nav-item">
    <Link className="nav-link qb-link" to="/instamart">Instamart</Link>
  </li>

  <li className="nav-item">
    <Link className="nav-link qb-link" to="/delivery">Ride with us</Link>
  </li>

  <li className="nav-item">
    <Link className="nav-link qb-link" to="/partner">Partner With Us</Link>
  </li>

  <li className="nav-item">
    <Link className="nav-link qb-link" to="/help-support">Help & Support</Link>
  </li>
</ul>

          <div className="d-flex align-items-center gap-2">
            {!loggedIn ? (
              <>
                <Link className="btn btn-outline-light" to="/login">
                  Login
                </Link>
                <Link className="btn btn-warning fw-bold" to="/register">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <span className="text-light fw-semibold">👤 {username}</span>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
