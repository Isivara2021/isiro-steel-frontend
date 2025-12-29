import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../../context/AdminContext";
import { FaUserShield, FaUser, FaLock } from "react-icons/fa";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  // Use environment variable for backend URL
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill in both fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        loginAdmin({ ...data.admin, token: data.token });
        navigate("/admin/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <FaUserShield className="admin-icon" />
          <h2>Admin Access</h2>
          <p>Secure login for administrators</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            Login to Dashboard
          </button>
        </form>

        <div className="admin-login-footer">
          <span>ISIRO Industries • Admin Panel</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
