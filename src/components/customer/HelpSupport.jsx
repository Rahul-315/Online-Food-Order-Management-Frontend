import React from "react";
import "./HelpSupport.css";

const HelpSupport = () => {
  return (
    <div className="help-container">
      <div className="help-header">
        <h1>Help & Support</h1>
        <p>We’re here to help you with anything related to QuickBite 🍔</p>
      </div>

      <div className="help-cards">
        <div className="help-card">
          <h3>Order Issues</h3>
          <p>Problems with placing, tracking, or receiving your order.</p>
          <button>Get Help</button>
        </div>

        <div className="help-card">
          <h3>Payment & Refunds</h3>
          <p>Issues with payments, failed transactions, or refunds.</p>
          <button>View Details</button>
        </div>

        <div className="help-card">
          <h3>Account & Profile</h3>
          <p>Help with login, password, or profile updates.</p>
          <button>Manage Account</button>
        </div>

        <div className="help-card">
          <h3>Delivery Support</h3>
          <p>Late delivery, missing items, or delivery partner issues.</p>
          <button>Track Support</button>
        </div>
      </div>

      <div className="help-contact">
        <h2>Still need help?</h2>
        <p>Contact our support team anytime</p>

        <div className="contact-box">
          <div>
            <strong>Email</strong>
            <p>support@quickbite.com</p>
          </div>
          <div>
            <strong>Phone</strong>
            <p>+91 98765 43210</p>
          </div>
          <div>
            <strong>Support Hours</strong>
            <p>24 × 7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
