import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/Loader/Loader";
import { getProducts } from "../../services/productService";
import "./Products.css";

// Define your collections/categories
const categories = [
  "Furniture",
  "Decorative Items",
  "Outdoor Pieces",
  "Kitchenware",
  "Hand Railings",
  "Other",
];

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by category
  const getProductsByCategory = (category) => {
    return products.filter((p) => p.category === category);
  };

  return (
    <>
      <Navbar />

      <div className="products-page">
        {/* Page Heading */}
        <div className="page-heading">
          <h1>Our Products</h1>
          <p>Handcrafted Steel and Wood for the Modern Home</p>
        </div>

        {loading ? (
          <Loader text="Loading products..." />
        ) : (
          <>
            {categories.map((category) => {
              const categoryProducts = getProductsByCategory(category);

              // Skip empty categories
              if (categoryProducts.length === 0) return null;

              return (
                <div key={category} className="collection-section">
                  <h2 className="collection-title">{category}</h2>

                  <div className="products-grid">
                    {categoryProducts.map((product) => (
                      <div
                        key={product._id}
                        className="product-card-wrapper"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Products;
