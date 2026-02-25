import React from "react";
import Footer from "../components/customer/Footer";
import "./About.css";

const About = () => {
  return (
    <div className="about-page container mt-5 pt-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">About QuickBite 🍔</h1>
        <p className="text-muted mt-2">
          Your favorite food, delivered fast and fresh
        </p>
      </div>

      <div className="row align-items-center mb-5">
        <div className="col-md-6 mb-4 mb-md-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            alt="Food delivery"
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-6">
          <h3 className="fw-semibold">Who We Are</h3>
          <p className="text-muted">
            QuickBite is an online food ordering platform designed to connect
            customers with their favorite restaurants. Our goal is to make food
            ordering simple, fast, and enjoyable for everyone.
          </p>

          <h3 className="fw-semibold mt-4">What We Do</h3>
          <p className="text-muted">
            From browsing restaurants to tracking orders in real-time, QuickBite
            delivers a seamless experience using modern web technologies and
            secure authentication.
          </p>
        </div>
      </div>

      <div className="row text-center g-4">
        <div className="col-md-4">
          <div className="card shadow h-100">
            <div className="card-body">
              <h5 className="card-title">🚀 Fast Delivery</h5>
              <p className="text-muted">
                Get your food delivered quickly and reliably.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow h-100">
            <div className="card-body">
              <h5 className="card-title">🔐 Secure Login</h5>
              <p className="text-muted">
                JWT-based authentication for user safety.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow h-100">
            <div className="card-body">
              <h5 className="card-title">🍽️ Quality Food</h5>
              <p className="text-muted">
                Partnered with trusted restaurants near you.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
