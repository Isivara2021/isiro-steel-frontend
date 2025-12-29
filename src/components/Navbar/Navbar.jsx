import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const closeMenu = () => {
    setMenuActive(false);
  };

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

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/news">News</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${menuActive ? "active" : ""}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/products" onClick={closeMenu}>Products</Link>
        <Link to="/gallery" onClick={closeMenu}>Gallery</Link>
        <Link to="/news" onClick={closeMenu}>News</Link>
        <Link to="/contact" onClick={closeMenu}>Contact Us</Link>
        <button className="mobile-menu-close" onClick={closeMenu}>✕</button>
      </div>
    </header>
  );
};

export default Navbar;
