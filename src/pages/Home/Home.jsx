import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Home.css";

import hero1 from "../../assets/hero1.webp";
import hero2 from "../../assets/hero2.webp";
import hero3 from "../../assets/hero3.webp";
import hero4 from "../../assets/hero4.webp";
import hero5 from "../../assets/hero5.webp";
import hero6 from "../../assets/hero6.webp";
import hero7 from "../../assets/hero7.webp";

import furnitureImage from "../../assets/furniture.webp";
import decorativeImage from "../../assets/decorative.webp";
import outdoorImage from "../../assets/outdoor.webp";
import kitchenImage from "../../assets/kitchen.webp";
import railingImage from "../../assets/railing.webp";
import otherImage from "../../assets/other.webp";

const heroImages = [hero1, hero2, hero3, hero4, hero5, hero6, hero7];

const Home = () => {
  const navigate = useNavigate();
  const [currentHero, setCurrentHero] = useState(0);

  // ✅ Scroll to top on page load (desktop & mobile)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  /* Auto slide hero images */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const collections = [
    {
      name: "Furniture",
      image: furnitureImage,
      description: "Tables, Chairs & More",
      category: "Furniture",
    },
    {
      name: "Decor",
      image: decorativeImage,
      description: "Vases, Frames & Art",
      category: "Decorative Items",
    },
    {
      name: "Outdoor",
      image: outdoorImage,
      description: "Garden & Patio",
      category: "Outdoor Pieces",
    },
    {
      name: "Kitchenware",
      image: kitchenImage,
      description: "Bowls, Utensils & Crafts",
      category: "Kitchenware",
    },
    {
      name: "Hand Railings",
      image: railingImage,
      description: "Stairs & Balconies",
      category: "Hand Railings",
    },
    {
      name: "Other",
      image: otherImage,
      description: "Miscellaneous",
      category: "Other",
    },
  ];

  return (
    <div className="home">
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-left">
            <span className="hero-est">Est. 2025</span>

            <h1>
              Where <span className="highlight-primary">Steel</span> Meets{" "}
              <span className="highlight-secondary">Artistry</span>
            </h1>

            <p>
              ISIRO Steel Industries blends the raw strength of steel with the
              organic warmth of wood. We craft unique, high-quality houseware
              that turns everyday objects into functional masterpieces.
            </p>

            <div className="hero-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate("/products")}
              >
                Explore Collection
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate("/gallery")}
              >
                View Gallery
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <h3>200+</h3>
                <p>Unique Designs</p>
              </div>
              <div>
                <h3>100%</h3>
                <p>Fully Customizable</p>
              </div>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="hero-right">
            <div className="hero-image-frame">
              {heroImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Hero ${index + 1}`}
                  className={`hero-image ${index === currentHero ? "active" : ""}`}
                  loading="lazy"
                />
              ))}

              {/* DOTS */}
              <div className="hero-dots" aria-label="Hero slider navigation">
                {heroImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`hero-dot ${idx === currentHero ? "active" : ""}`}
                    onClick={() => setCurrentHero(idx)}
                    role="button"
                    aria-label={`Show hero image ${idx + 1}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setCurrentHero(idx);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* COLLECTIONS */}
        <section className="collections-section">
          <h2>Our Collections</h2>

          <div className="collections-grid">
            {collections.map((col, idx) => (
              <div
                key={idx}
                className="collection-card"
                onClick={() =>
                  navigate(`/products?category=${col.category}`)
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    navigate(`/products?category=${col.category}`);
                }}
                aria-label={`View ${col.name} collection`}
              >
                <div className="collection-image">
                  <img src={col.image} alt={col.name} loading="lazy" />
                  <div className="collection-overlay"></div>
                </div>

                <div className="collection-text">
                  <h4>{col.name}</h4>
                  <p>{col.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
