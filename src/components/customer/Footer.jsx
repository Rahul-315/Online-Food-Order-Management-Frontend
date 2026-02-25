import React from "react";
import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";
import playstore from "../../assets/images/playstore.png";
import appstore from "../../assets/images/appstore.png";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="qb-footer">
      {/* APP DOWNLOAD SECTION */}
      <div className="footer-app-banner">
        <h4>For better experience, download the QuickBite app now</h4>
        <div className="store-buttons">
          <img src={playstore} alt="Play Store" />
          <img src={appstore} alt="App Store" />
        </div>
      </div>

      {/* MAIN FOOTER CONTENT */}
      <div className="footer-content">
        <div>
          <h6>Company</h6>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/Quick">QuickBite One</Link></li>
            <li><Link to="/instamart">Instamart</Link></li>
          </ul>
        </div>

        <div>
          <h6>Contact Us</h6>
          <ul>
            <li><Link to="/help-support">Help & Support</Link></li>
            <li><Link to="/partner">Partner with us</Link></li>
            <li><Link to="/delivery">Ride with us</Link></li>
          </ul>
        </div>

        <div>
          <h6>Legal</h6>
          <ul>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/cookies">Cookie Policy</Link></li>
          </ul>
        </div>

        <div>
          <h6>Available in</h6>
          <ul>
            <li>Bangalore</li>
            <li>Hyderabad</li>
            <li>Delhi</li>
            <li>Mumbai</li>
            <li>Pune</li>
          </ul>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="footer-bottom">
        <p>© 2025 QuickBite Limited</p>

        <div className="social-links">
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

