// src/components/Footer/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Branding */}
          <div className="footer-item">
            <h3>ISIRO Steel Industries</h3>
            <p>Where Steel Meets Artistry</p>
          </div>

          {/* Quick Links */}
          <div className="footer-item">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/gallery">Gallery</Link>
              </li>
              <li>
                <Link to="/news">News</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-item">
            <h4>Contact</h4>
            <ul>
              <li>
                <span className="material-symbols-outlined">location_on</span>
                No.247, Veyangoda Rd, Urapola.
              </li>
              <li>
                <span className="material-symbols-outlined">mail</span>
                sunimalpremaratne@gmail.com
              </li>
              <li>
                <span className="material-symbols-outlined">call</span>
                (+94)712653157
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-item">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a
                href="https://www.facebook.com/profile.php?id=61582691996358&mibextid=ZbWKwL"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© 2026 ISIRO Steel Industries. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
