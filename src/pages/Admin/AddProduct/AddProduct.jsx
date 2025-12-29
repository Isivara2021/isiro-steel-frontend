import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../../context/AdminContext";
import { FaBoxOpen } from "react-icons/fa";
import { compressImage } from "../../../utils/imageCompression";
import "./AddProduct.css";

/* =======================
   INPUT SAFETY LIMITS
======================= */
const LIMITS = {
  name: 30,
  shortDescription: 100,
  description: 2000,
  maxImages: 5,
  maxImageSizeMB: 5,
  maxPrice: 10000000,
};

const AddProduct = () => {
  const { admin } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) navigate("/admin/login");
  }, [admin, navigate]);

  const [product, setProduct] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    category: "Furniture",
    images: [],
  });

  const [errors, setErrors] = useState([]);
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
     HANDLE FIELD CHANGE
  ======================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0 || num > LIMITS.maxPrice) return;
    }

    setProduct({ ...product, [name]: value });
  };

  /* =======================
     HANDLE FILE UPLOAD
  ======================= */
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > LIMITS.maxImages) {
      alert(`Maximum ${LIMITS.maxImages} images allowed.`);
      e.target.value = null;
      return;
    }

    try {
      const compressedImages = [];

      for (let file of files) {
        if (!file.type.startsWith("image/")) {
          alert("Only image files are allowed.");
          e.target.value = null;
          return;
        }

        if (file.size > LIMITS.maxImageSizeMB * 1024 * 1024) {
          alert(`Each image must be under ${LIMITS.maxImageSizeMB}MB.`);
          e.target.value = null;
          return;
        }

        const compressed = await compressImage(file);
        compressedImages.push(compressed);
      }

      setProduct({ ...product, images: compressedImages });
    } catch (err) {
      console.error(err);
      alert("Image compression failed");
    }
  };

  /* =======================
     HANDLE FORM SUBMIT
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admin?.token) {
      alert("Admin not logged in");
      return;
    }

    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      if (key !== "images") {
        formData.append(key, product[key]);
      }
    });

    product.images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Product added successfully!");
        navigate("/admin/dashboard");
      } else if (data.errors) {
        setErrors(data.errors.map((err) => `${err.param}: ${err.msg}`));
      } else {
        alert(data.message || "Failed to add product");
      }
    } catch (err) {
      console.error("Server error:", err);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     CHARACTER COUNTER
  ======================= */
  const Counter = ({ value, limit }) => (
    <span
      className="char-counter"
      style={{ color: value.length >= limit ? "#d11a2a" : "#666" }}
    >
      {value.length}/{limit}
    </span>
  );

  return (
    <div className="add-product-page">
      <div className="back-btn-container">
        <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="add-product-card">
        <form className="add-product-form" onSubmit={handleSubmit}>
          <header className="add-product-header">
            <FaBoxOpen className="header-icon" />
            <h1>Add New Product</h1>
            <p>Create and publish a new product listing</p>
          </header>

          {errors.length > 0 && (
            <div className="backend-errors">
              {errors.map((err, idx) => (
                <p key={idx} style={{ color: "#d11a2a", fontSize: "0.9rem" }}>
                  {err}
                </p>
              ))}
            </div>
          )}

          <div className="input-with-counter">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={product.name}
              onChange={handleChange}
              maxLength={LIMITS.name}
              required
            />
            <Counter value={product.name} limit={LIMITS.name} />
          </div>

          <div className="input-with-counter">
            <input
              type="text"
              placeholder="Short Description"
              name="shortDescription"
              value={product.shortDescription}
              onChange={handleChange}
              maxLength={LIMITS.shortDescription}
            />
            <Counter
              value={product.shortDescription}
              limit={LIMITS.shortDescription}
            />
          </div>

          <div className="input-with-counter">
            <textarea
              placeholder="Description"
              name="description"
              value={product.description}
              onChange={handleChange}
              maxLength={LIMITS.description}
            />
            <Counter value={product.description} limit={LIMITS.description} />
          </div>

          <div className="form-row">
            <input
              type="number"
              placeholder="Price"
              name="price"
              value={product.price}
              onChange={handleChange}
              min="0"
              max={LIMITS.maxPrice}
              step="0.01"
              required
            />

            <select
              name="category"
              value={product.category}
              onChange={handleChange}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
