import React, { useState } from "react";
import StaffNavbar from "../components/staff/StaffNavbar";
import StaffMenu from "../components/staff/StaffMenu";
import StaffOrders from "../components/staff/StaffOrders";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StaffDashboard.css";
const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("Menu");

  return (
    <div className="staff-dashboard">
      <StaffNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-bg-overlay">
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-12 ">
              <div className="staff-content fade-in">
                {activeTab === "Menu" && <StaffMenu />}
                {activeTab === "Orders" && <StaffOrders />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
