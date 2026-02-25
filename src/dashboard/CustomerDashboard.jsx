// src/pages/CustomerDashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import CustomerNavbar from "../components/customer/CustomerNavbar";
import CustomerRestaurants from "../components/customer/CustomerRestaurants";
import CustomerCart from "../components/customer/CustomerCart";
import CustomerOrders from "../components/customer/CustomerOrders";
import { Container } from "react-bootstrap";
import { CartProvider, useCart } from "../context/CartContext";
import { isAuthenticated } from "../auth/auth";
import { useNavigate } from "react-router-dom"; // ✅ ADDED
import "./CustomerDashboard.css";
import Footer from "../components/customer/Footer";

const CustomerDashboardContent = () => {
  const [activeTab, setActiveTab] = useState("Restaurants");
  const [searchQuery, setSearchQuery] = useState("");
  const cartElementRef = useRef(null);
  const { resetCart } = useCart();
  const navigate = useNavigate(); // ✅ ADDED

  // Reset cart when switching to Cart tab
  useEffect(() => {
    if (activeTab === "Cart") resetCart();
  }, [activeTab, resetCart]);

  // Clear search query when tab changes
  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case "Restaurants":
        return (
          <CustomerRestaurants
            searchQuery={searchQuery}
            requireLogin={() => {
              if (!isAuthenticated()) {
                navigate("/login"); // ✅ CHANGED (alert → redirect)
              }
            }}
          />
        );

      case "Cart":
        return <CustomerCart searchQuery={searchQuery} />;

      case "Orders":
        return <CustomerOrders searchQuery={searchQuery} />;

      default:
        return <CustomerRestaurants searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="customer-dashboard">
      <CustomerNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartRef={cartElementRef}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ✅ HERO SECTION – ONLY FOR RESTAURANTS */}
      {!isAuthenticated()  && (
        <div className="hero-section">
          <h1 className="display-4 fw-bold">🍔 Welcome to QuickBite</h1>
          <p className="lead mt-2">
            Order from your favorite restaurants, fast & easy!
          </p>
          <div className="search-bar mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search restaurants or food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      
      )}

      <Container className="tab-content py-4">{renderTab()}</Container>

     {/* ✅ CTA – ONLY FOR GUEST USERS (BEFORE LOGIN) */}
       {   !isAuthenticated() && (
  <div className="cta-section text-center py-5">
    <h2 className="fw-bold">Ready to order delicious food?</h2>
    <p className="mt-2">Create an account and get started today!</p>
    <a href="/register" className="btn btn-success btn-lg mt-3">
      Get Started
    </a>
  </div>
)}
   {!isAuthenticated() && <Footer />}
    </div>
  );
};

const CustomerDashboard = () => (
  <CartProvider>
    <CustomerDashboardContent />
  </CartProvider>
);

export default CustomerDashboard;
