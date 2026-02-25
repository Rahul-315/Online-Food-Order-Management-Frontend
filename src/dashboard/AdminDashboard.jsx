import React, { useState } from "react";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminUsers from "../components/admin/AdminUsers";
import AdminRestaurants from "../components/admin/AdminRestaurants";
import AdminMenuItems from "../components/admin/AdminMenuItems";
import AdminOrders from "../components/admin/AdminOrders";
import "./AdminDashboard.css";
import AdminPartnerRestaurants from "../components/admin/AdminPartnerRestaurants";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Users");
  const [searchTerm, setSearchTerm] = useState("");

  const renderTab = () => {
    switch (activeTab) {
      case "Users":
        return <AdminUsers searchTerm={searchTerm} />;
      case "Restaurants":
        return <AdminRestaurants searchTerm={searchTerm} />;
      case "MenuItems":
        return <AdminMenuItems searchTerm={searchTerm} />;
      case "AdminPartnerRestaurants":
        return <AdminPartnerRestaurants searchTerm={searchTerm} />;
     // case "Orders":
       // return <AdminOrders searchTerm={searchTerm} />;
      default:
        return null;
    }
  };

  return (
    <>
      <AdminNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSearchTerm={setSearchTerm}
      />
      <div className="admin-content">{renderTab()}</div>
    </>
  );
};

export default AdminDashboard;
