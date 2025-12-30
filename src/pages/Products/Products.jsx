import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/Loader/Loader"; // ✅ Import Loader
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
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const productsPerPage = 8;

  // Fetch all products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // ✅ Stop loading when fetch completes
      }
    }
    fetchProducts();
  }, []);

  // Update activeCategory when URL changes
  useEffect(() => {
    setActiveCategory(initialCategory);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [initialCategory]);

  const filteredProducts = products.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <>
      <Navbar />

      <div className="products-page">
        <div className="page-heading">
          <h1>Our Products</h1>
          <p>Handcrafted Steel and Wood for the Modern Home</p>
        </div>

        <div className="category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={activeCategory === cat ? "active-chip" : "chip"}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentPage(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
                navigate(`/products${cat !== "All" ? `?category=${cat}` : ""}`);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ✅ Loader */}
        {loading ? (
          <Loader text="Loading products..." />
        ) : (
          <div className="products-grid">
            {currentProducts.length === 0 && (
              <p>No products available in this category.</p>
            )}
            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="product-card-wrapper"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Products;
