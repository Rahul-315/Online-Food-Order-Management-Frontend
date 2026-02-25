import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../auth/auth";
import "./StaffNavbar.css";

const StaffNavbar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const tabs = ["Menu", "Orders"];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="staff-navbar navbar navbar-expand-lg sticky-top shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <span className="navbar-brand fw-bold staff-brand">
          Staff Dashboard
        </span>
        <ul className="navbar-nav flex-row gap-3">
          {tabs.map((tab) => (
            <li key={tab} className="nav-item">
              <span
                className={`nav-link staff-nav-link ${
                  activeTab === tab ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </span>
            </li>
          ))}
        </ul>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white staff-username">Hi, Staff </span>
          <button
            className="btn staff-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StaffNavbar;
