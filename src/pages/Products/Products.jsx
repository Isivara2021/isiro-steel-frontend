import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import ProductCard from "../../components/ProductCard/ProductCard";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
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
  const location = useLocation(); // Get URL
  const params = new URLSearchParams(location.search);
  const initialCategory = params.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
  setActiveCategory(initialCategory);
  setCurrentPage(1);
  window.scrollTo(0, 0); // Scroll to top whenever category changes
}, [initialCategory]);


  // If URL category changes while staying on page, update filter
  useEffect(() => {
    setActiveCategory(initialCategory);
    setCurrentPage(1);
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
              }}
            >
              {cat}
            </button>
          ))}
        </div>

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

        {totalPages > 1 && (
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
