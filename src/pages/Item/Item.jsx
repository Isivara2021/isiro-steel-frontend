import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { getProductById } from "../../services/productService";
import { FaWhatsapp } from "react-icons/fa";
import Loader from "../../components/Loader/Loader"; 
import "./Item.css";

const API_URL = process.env.REACT_APP_API_URL;

const Item = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [selectedImage, setSelectedImage] = useState(0);

  // Scroll to top whenever the product ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); 
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader text="Loading product..." />; 

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${API_URL}${img}`;
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
                  alt={product.name + " thumbnail"}
                  className={idx === selectedImage ? "active" : ""}
                  onClick={() => setSelectedImage(idx)}
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="details">
            <h1>{product.name}</h1>

            {product.price && <p className="price">LKR {product.price}</p>}

            {product.description && (
              <p className="description preserve-lines">
                {product.description}
              </p>
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
