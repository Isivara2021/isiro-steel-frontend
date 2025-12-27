// src/pages/Item/Item.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { getProductById } from "../../services/productService";
import { FaWhatsapp } from "react-icons/fa";
import "./Item.css";

const Item = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProduct();
  }, [id]);

  if (!product) return <div className="loading">Loading...</div>;

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000${img}`;
  };

  const handleWhatsApp = () => {
    const message = `Hello! I would like to check the availability of "${product.name}".`;
    window.open(
      `https://wa.me/94712653157?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <>
      <Navbar />

      <div className="item-page">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <strong>{product.name}</strong>
        </div>

        <div className="item-container">
          {/* Image Section */}
          <div className="gallery">
            <div className="main-image-box">
              <img
                src={getImageUrl(product.images[selectedImage])}
                alt={product.name}
              />
            </div>

            <div className="thumbnail-row">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt=""
                  className={idx === selectedImage ? "active" : ""}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="details">
            <h1>{product.name}</h1>

            {product.price && (
              <p className="price">LKR {product.price}</p>
            )}

            {product.description && (
              <p className="description">{product.description}</p>
            )}

            {product.specifications && (
              <div className="specs">
                <h3>Technical Specifications</h3>
                <ul>
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <li key={key}>
                      <span>{key}</span>
                      <span>{val}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button className="whatsapp-btn" onClick={handleWhatsApp}>
              <FaWhatsapp />
              Inquire via WhatsApp
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Item;
