// src/components/Navbar/Navbar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-icon">
            <img
              src={require("../../assets/logo.png")}
              alt="ISIRO Steel Logo"
              className="logo-image"
            />
          </div>
          <h2 className="logo-text">ISIRO Steel Industries</h2>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/news">News</Link> {/* Added News link */}
          <Link to="/contact">Contact Us</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
