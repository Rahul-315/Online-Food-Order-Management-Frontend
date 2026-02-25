import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../auth/auth";
import { FaUserCircle } from "react-icons/fa";
import "./AdminNavbar.css";


const AdminNavbar = ({ activeTab, setActiveTab, setSearchTerm }) => {
  const navigate = useNavigate();

  const tabs = ["Users", "Restaurants", "AdminPartnerRestaurants", "MenuItems" /*, "Orders"*/];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold">Admin Dashboard</span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab}>
                <span
                  className={`nav-link ${
                    activeTab === tab ? "active fw-bold" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </span>
              </li>
            ))}
          </ul>
          <input
            type="text"
            className="form-control form-control-sm me-3"
            placeholder={`Search ${activeTab}`}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="d-flex align-items-center text-white">
          <FaUserCircle
              size={28}
            className="me-3"
                 style={{ color: "white", cursor: "pointer" }}
              />


            <button
              className="btn btn-outline-warning btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
