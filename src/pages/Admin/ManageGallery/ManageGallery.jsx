import React, { useEffect, useState, useContext } from "react";
import { AdminContext } from "../../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import "./ManageGallery.css";

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { admin } = useContext(AdminContext);
  const navigate = useNavigate();

  /* =======================
     FETCH IMAGES
  ======================= */
  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/gallery");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Fetch gallery error:", err);
      alert("Failed to fetch gallery images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  /* =======================
     DELETE IMAGE
  ======================= */
  const handleDelete = async (id) => {
    if (!admin?.token) {
      alert("Admin not logged in");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${admin.token}` },
      });

      if (res.ok) {
        alert("Image deleted successfully");
        fetchImages();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete image");
      }
    } catch (err) {
      console.error("Delete gallery error:", err);
      alert("Server error while deleting image");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     GROUP IMAGES BY CATEGORY
  ======================= */
  const groupedImages = images.reduce((acc, img) => {
    if (!acc[img.category]) acc[img.category] = [];
    acc[img.category].push(img);
    return acc;
  }, {});

  return (
    <div className="manage-gallery-page-wrapper">
      <div className="manage-gallery-page">
        <button
          className="back-btn"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <h2>Manage Gallery</h2>

        {loading && <p className="loading-text">Loading...</p>}

        {!loading && images.length === 0 && (
          <p className="empty-text">No images found</p>
        )}

        {!loading &&
          Object.keys(groupedImages).map((category) => (
            <div key={category} className="category-section">
              <h3>{category}</h3>
              <div className="gallery-grid">
                {groupedImages[category].map((img) => (
                  <div key={img._id} className="gallery-card">
                    <img
                      src={img.imageUrl} // use the full Cloudinary URL
                      alt={img.title || "Gallery Image"}
                    />
                    <div className="gallery-info">
                      <p className="gallery-title">{img.title || "Untitled"}</p>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(img._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ManageGallery;
