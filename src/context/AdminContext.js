import React, { createContext, useState, useEffect } from "react";

// Create the context
export const AdminContext = createContext();

// Provider component
export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  // Load admin from localStorage on app start
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      const parsedAdmin = JSON.parse(storedAdmin);
      // Optional: check for token expiration
      if (!parsedAdmin.expiry || new Date(parsedAdmin.expiry) > new Date()) {
        setAdmin(parsedAdmin);
      } else {
        localStorage.removeItem("admin");
      }
    }
  }, []);

  // Persist admin state in localStorage whenever it changes
  useEffect(() => {
    if (admin) {
      localStorage.setItem("admin", JSON.stringify(admin));
    } else {
      localStorage.removeItem("admin");
    }
  }, [admin]);

  // Login admin with token and optional expiry
  const loginAdmin = (adminData, expiryMinutes = 60) => {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + expiryMinutes);
    setAdmin({ ...adminData, expiry: expiryDate.toISOString() });
  };

  // Logout admin
  const logoutAdmin = () => {
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
