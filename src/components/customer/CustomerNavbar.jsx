import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUtensils,
  FaShoppingCart,
  FaBoxOpen,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { logout } from "../../auth/auth";
import { useCart } from "../../context/CartContext";
import "./CustomerNavbar.css";
import quickBiteLogo from "../../assets/images/quickbite.png";

// ✅ Add CustomerProfileModal
import CustomerProfileModal from "./CustomerProfileModal";

const CustomerNavbar = ({
  activeTab,
  setActiveTab,
  cartRef,
  searchQuery,
  setSearchQuery,
}) => {
  const navigate = useNavigate();
  const { cartCount, orderCount } = useCart();
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // ✅ New state for username
  const [userName, setUserName] = useState("");

  // ✅ Fetch logged-in username
  useEffect(() => {
    import("../../api/customer").then(({ getMyProfile }) => {
      getMyProfile()
        .then((res) => {
          setUserName(res.data.username || "");
        })
        .catch((err) => console.log("Failed to fetch profile", err));
    });
  }, []);

  const tabs = [
    { name: "Restaurants", icon: <FaUtensils /> },
    {
      name: "Cart",
      icon: (
        <div
          className={`cart-icon-wrapper ${cartCount ? "cart-bounce" : ""}`}
          ref={cartRef}
        >
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      ),
    },
    {
      name: "Orders",
      icon: (
        <div className={`cart-icon-wrapper ${orderCount ? "cart-bounce" : ""}`}>
          <FaBoxOpen />
          {orderCount > 0 && (
            <span className="cart-badge order-badge">{orderCount}</span>
          )}
        </div>
      ),
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="customer-navbar">
        {/* ✅ LEFT FIXED LOGO */}
        <div className="brand">
          <img src={quickBiteLogo} alt="QuickBite" />
        </div>

        <div className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`nav-tab ${activeTab === tab.name ? "active" : ""}`}
              onClick={() => setActiveTab(tab.name)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-text">{tab.name}</span>
            </button>
          ))}
        </div>

        <input
          type="text"
          className="navbar-search"
          placeholder={
            activeTab === "Restaurants"
              ? "Search restaurants or menu items..."
              : activeTab === "Cart"
              ? "Search items in your cart..."
              : "Search your orders..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="right-actions">
          <div className="profile-wrapper">
            <button
              className="icon-btn"
              onClick={() => setShowProfile(!showProfile)}
            >
              <FaUserCircle />
              <span className="username-display">{userName}</span>
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <button
                  onClick={() => {
                    setShowProfile(false);
                    setShowProfileModal(true);
                  }}
                >
                  <FaUserCircle /> Edit Profile
                </button>

                <button onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="bottom-navbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`bottom-tab ${activeTab === tab.name ? "active" : ""}`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* ✅ Profile Modal */}
      <CustomerProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};

export default CustomerNavbar;
