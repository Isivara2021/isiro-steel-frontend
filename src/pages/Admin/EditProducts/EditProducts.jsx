import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { compressImage } from "../../../utils/imageCompression";
import "./EditProducts.css";

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

const EditProducts = () => {
  const { admin } = useContext(AdminContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Furniture",
    "Decorative Items",
    "Outdoor Pieces",
    "Kitchenware",
    "Hand Railings",
    "Other",
  ];

  useEffect(() => {
    if (!admin?.token) {
      navigate("/admin/login");
      return;
    }
    fetchProducts();
  }, [admin, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewImages([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${admin.token}` },
      });

      if (res.ok) {
        alert("Product deleted");
        fetchProducts();
      } else {
        alert("Delete failed");
      }
    } catch {
      alert("Server error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0 || num > LIMITS.maxPrice) return;
    }

    setEditingProduct({ ...editingProduct, [name]: value });
  };

  /* =======================
     IMAGE HANDLING (with compression)
  ======================== */
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const totalImages =
      (editingProduct.images?.length || 0) + newImages.length + files.length;

    if (totalImages > LIMITS.maxImages) {
      alert(`Maximum ${LIMITS.maxImages} images allowed`);
      return;
    }

    try {
      setLoading(true);
      const compressedImages = [];

      for (let file of files) {
        if (!file.type.startsWith("image/")) {
          alert("Only image files allowed");
          continue;
        }
        if (file.size > LIMITS.maxImageSizeMB * 1024 * 1024) {
          alert(`Each image must be under ${LIMITS.maxImageSizeMB}MB`);
          continue;
        }

        const compressed = await compressImage(file);
        compressedImages.push(compressed);
      }

      setNewImages([...newImages, ...compressedImages]);
    } catch (err) {
      console.error("Image compression failed:", err);
      alert("Failed to process images");
    } finally {
      setLoading(false);
    }
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imgIndex) => {
    if (!window.confirm("Remove this image?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${editingProduct._id}/images/${imgIndex}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${admin.token}` },
        }
      );

      if (res.ok) {
        setEditingProduct((prev) => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== imgIndex),
        }));
      } else {
        alert("Failed to remove image");
      }
    } catch {
      alert("Server error");
    }
  };

  /* =======================
     SUBMIT UPDATE
  ======================== */
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      ["name", "shortDescription", "description", "price", "category"].forEach(
        (field) => formData.append(field, editingProduct[field])
      );
      newImages.forEach((img) => formData.append("images", img));

      const res = await fetch(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${admin.token}` },
          body: formData,
        }
      );

      if (res.ok) {
        alert("Product updated");
        setEditingProduct(null);
        setNewImages([]);
        fetchProducts();
      } else {
        alert("Update failed");
      }
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const Counter = ({ value, limit }) => (
    <span className="char-counter">{(value?.length || 0) + "/" + limit}</span>
  );

  return (
    <div className="edit-product-page-wrapper">
      <div className="edit-product-page">
        <button
          className="back-btn"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <h2>Manage Products</h2>

        {!editingProduct && (
          <div className="products-list">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt={product.name || ""} />
                )}
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p>{product.category}</p>
                  <p>₨. {Number(product.price).toLocaleString()}</p>
                </div>
                <div className="product-buttons">
                  <button onClick={() => handleEditClick(product)}>Edit</button>
                  <button onClick={() => handleDelete(product._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {editingProduct && (
          <form className="edit-product-form" onSubmit={handleUpdate}>
            <h3>Edit Product</h3>

            <div className="input-with-counter">
              <input
                name="name"
                value={editingProduct.name}
                onChange={handleChange}
                maxLength={LIMITS.name}
                required
              />
              <Counter value={editingProduct.name} limit={LIMITS.name} />
            </div>

            <div className="input-with-counter">
              <input
                name="shortDescription"
                value={editingProduct.shortDescription}
                onChange={handleChange}
                maxLength={LIMITS.shortDescription}
              />
              <Counter
                value={editingProduct.shortDescription}
                limit={LIMITS.shortDescription}
              />
            </div>

            <div className="input-with-counter">
              <textarea
                name="description"
                value={editingProduct.description}
                onChange={handleChange}
                maxLength={LIMITS.description}
              />
              <Counter
                value={editingProduct.description}
                limit={LIMITS.description}
              />
            </div>

            <input
              type="number"
              name="price"
              value={editingProduct.price}
              onChange={handleChange}
              max={LIMITS.maxPrice}
              required
            />

            <select
              name="category"
              value={editingProduct.category}
              onChange={handleChange}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {/* Images */}
            <div className="image-grid">
              {editingProduct.images.map((img, i) => (
                <div key={i} className="image-wrapper">
                  <img src={img} alt="" />
                  <button type="button" onClick={() => removeExistingImage(i)}>
                    ✕
                  </button>
                </div>
              ))}
              {newImages.map((img, i) => (
                <div key={i} className="image-wrapper">
                  <img src={URL.createObjectURL(img)} alt="" />
                  <button type="button" onClick={() => removeNewImage(i)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />

            <div className="form-buttons">
              <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </button>
              <button type="button" onClick={() => setEditingProduct(null)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProducts;
