import React from "react";
import "./Partner.css";
import { FaChartLine, FaTruck, FaCashRegister, FaUsers, FaHandshake, FaMobileAlt } from "react-icons/fa";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <FaChartLine />,
    title: "Boost Online Visibility",
    description: "Showcase your restaurant to thousands of hungry customers nearby.",
  },
  {
    icon: <FaTruck />,
    title: "Delivery & Logistics Support",
    description: "Seamless delivery integration so you can focus on cooking.",
  },
  {
    icon: <FaCashRegister />,
    title: "Fast & Secure Payouts",
    description: "Get your earnings quickly with easy payout options.",
  },
  {
    icon: <FaUsers />,
    title: "Customer Insights",
    description: "Understand your customers with detailed analytics and reports.",
  },
  {
    icon: <FaHandshake />,
    title: "Marketing Support",
    description: "Run promotions and campaigns to attract more customers.",
  },
  {
    icon: <FaMobileAlt />,
    title: "Easy App Management",
    description: "Manage orders, menus, and reviews directly from your phone.",
  },
];

const Partner = () => (
    <>
  <div className="partner-container">
    <header className="partner-header">
      <h1>Partner with QuickBite</h1>
      <p>Grow your restaurant business and reach more customers than ever.</p>
      <Link to="/partner-register" className="partner-btn">
       Register Your Restaurant
      </Link>

    </header>

    <section className="partner-features">
      {features.map((feature, index) => (
        <div className="feature-card" key={index}>
          <div className="feature-icon">{feature.icon}</div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </section>

    <section className="partner-info">
      <div className="info-card">
        <h2>Why QuickBite?</h2>
        <ul>
          <li>🚀 Reach more customers than traditional platforms.</li>
          <li>📊 Track your sales and performance with real-time analytics.</li>
          <li>💼 Dedicated support team for onboarding and queries.</li>
          <li>🎯 Targeted campaigns to boost your revenue.</li>
        </ul>
      </div>

      <div className="info-card">
        <h2>Success Stories</h2>
        <p>
          Join hundreds of restaurants that have increased sales by 30%+ after partnering with QuickBite.
        </p>
      </div>
    </section>
    
  </div>
    <Footer />
  </>

);

export default Partner;
