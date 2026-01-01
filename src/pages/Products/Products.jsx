import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/Loader/Loader";
import { getProducts } from "../../services/productService";
import "./Products.css";

const categories = [
  "All",
  "Furniture",
  "Decorative Items",
  "Outdoor Pieces",
  "Kitchenware",
  "Hand Railings",
  "Other",
];

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialCategory = params.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  // Fetch all products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Update active category when URL changes
  useEffect(() => {
    setActiveCategory(initialCategory);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [initialCategory]);

  // Group products by category (excluding "All")
  const groupedProducts = categories.reduce((acc, cat) => {
    if (cat === "All") return acc;
    acc[cat] = products.filter((p) => p.category === cat);
    return acc;
  }, {});

  return (
    <>
      <Navbar />

      <div className="products-page">
        <div className="page-heading">
          <h1>Our Products</h1>
          <p>Handcrafted Steel and Wood for the Modern Home</p>
        </div>

        {/* Category Chips */}
        <div className="category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={activeCategory === cat ? "active-chip" : "chip"}
              onClick={() => {
                setActiveCategory(cat);
                window.scrollTo({ top: 0, behavior: "smooth" });
                navigate(`/products${cat !== "All" ? `?category=${cat}` : ""}`);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Sections */}
        {loading ? (
          <Loader text="Loading products..." />
        ) : activeCategory === "All" ? (
          categories
            .filter((cat) => cat !== "All")
            .map((cat) =>
              groupedProducts[cat]?.length > 0 ? (
                <section key={cat} className="category-section">
                  <h2 className="category-title">{cat}</h2>
                  <div className="products-grid">
                    {groupedProducts[cat].map((product) => (
                      <div
                        key={product._id}
                        className="product-card-wrapper"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </section>
              ) : null
            )
        ) : (
          <section className="category-section">
            <h2 className="category-title">{activeCategory}</h2>
            <div className="products-grid">
              {products
                .filter((p) => p.category === activeCategory)
                .map((product) => (
                  <div
                    key={product._id}
                    className="product-card-wrapper"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              {products.filter((p) => p.category === activeCategory).length === 0 && (
                <p>No products available in this category.</p>
              )}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Products;
