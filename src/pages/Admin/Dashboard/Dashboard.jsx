import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../../context/AdminContext";
import {
  FaBoxOpen,
  FaEdit,
  FaImages,
  FaFolderOpen,
  FaUserShield,
  FaNewspaper,
} from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const { admin } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin?.token) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  if (!admin) return null;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <FaUserShield className="dashboard-icon" />
        <h1>Admin Dashboard</h1>
        <p>
          Welcome back, <strong>{admin.username}</strong>
        </p>
      </header>

      <section className="dashboard-grid">
        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/add-product")}
        >
          <FaBoxOpen className="card-icon" />
          <h3>Add Product</h3>
          <p>Create and publish new products</p>
        </div>

        {/* ✅ FIXED */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/edit-products")}
        >
          <FaEdit className="card-icon" />
          <h3>Edit / Delete Products</h3>
          <p>Manage existing product listings</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/add-image")}
        >
          <FaImages className="card-icon" />
          <h3>Add Gallery Image</h3>
          <p>Upload new images to gallery</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/manage-gallery")}
        >
          <FaFolderOpen className="card-icon" />
          <h3>Manage Gallery</h3>
          <p>Edit or remove gallery items</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/manage-news")}
        >
          <FaNewspaper className="card-icon" />
          <h3>Manage News</h3>
          <p>Add, edit, or delete news items</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
