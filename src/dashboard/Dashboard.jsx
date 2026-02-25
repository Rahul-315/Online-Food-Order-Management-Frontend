import React from "react";
import { getUsername, getRole } from "../auth/auth";

const Dashboard = () => {
  const username = getUsername();
  const role = getRole();

  return (
    <div className="container mt-5 pt-5">
      <div className="text-center mb-4">
        <h1 className="fw-bold">Welcome, {username} 👋</h1>
        <p className="text-muted">
          You are logged in as <strong>{role}</strong>
        </p>
      </div>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <h5 className="card-title">📦 Orders</h5>
              <p className="card-text text-muted">
                Track and manage your orders easily.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <h5 className="card-title">🍽️ Restaurants</h5>
              <p className="card-text text-muted">
                Browse restaurants and explore menus.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <h5 className="card-title">⚙️ Profile</h5>
              <p className="card-text text-muted">
                Update your profile and account settings.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-5 text-muted">
        <small>
          © {new Date().getFullYear()} QuickBite — Order smart, eat happy 🍔
        </small>
      </div>
    </div>
  );
};

export default Dashboard;
