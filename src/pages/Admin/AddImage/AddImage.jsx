import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../../context/AdminContext";
import { compressImage } from "../../../utils/imageCompression";
import "./AddImage.css";

const AddImage = () => {
  const { admin } = useContext(AdminContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("Furniture");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Furniture",
    "Decorative Items",
    "Outdoor Pieces",
    "Kitchenware",
    "Hand Railings",
    "Other",
  ];

  /* =======================
     IMAGE SELECT + COMPRESS
  ======================= */
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }

    try {
      const compressed = await compressImage(file);
      setImage(compressed);
    } catch (err) {
      console.error("Compression error:", err);
      alert("Image compression failed");
    }
  };

  /* =======================
     SUBMIT
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admin?.token) {
      alert("Admin not logged in");
      navigate("/admin/login");
      return;
    }

    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/gallery`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add image");
      }

      alert("Image added successfully!");
      navigate("/admin/manage-gallery");
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.message || "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="add-image-page">
      <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
        ← Back to Dashboard
      </button>

      <form className="add-image-form" onSubmit={handleSubmit}>
        <h2>Add Gallery Image</h2>

        <input
          type="text"
          placeholder="Image title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Add Image"}
        </button>
      </form>
    </div>
  );
};

export default AddImage;
