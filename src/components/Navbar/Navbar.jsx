import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuActive(false);
  };

  /* =========================
     LOCK BODY SCROLL (MOBILE)
  ========================= */
  useEffect(() => {
    if (menuActive) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menuActive]);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <Link to="/" className="logo-section" onClick={closeMenu}>
          <div className="logo-icon">
            <img
              src={require("../../assets/logo.png")}
              alt="ISIRO Steel Logo"
              className="logo-image"
            />
          </div>
          <h2 className="logo-text">ISIRO Steel Industries</h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/news">News</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuActive}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${menuActive ? "active" : ""}`}
        aria-hidden={!menuActive}
      >
        <button
          className="mobile-menu-close"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          ✕
        </button>

        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/products" onClick={closeMenu}>Products</Link>
        <Link to="/gallery" onClick={closeMenu}>Gallery</Link>
        <Link to="/news" onClick={closeMenu}>News</Link>
        <Link to="/contact" onClick={closeMenu}>Contact Us</Link>
      </div>
    </header>
  );
};

export default Navbar;
