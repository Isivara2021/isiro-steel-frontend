import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { getGallery } from "../../services/galleryService";
import "./Gallery.css";

const categories = [
  "Furniture",
  "Decorative Items",
  "Outdoor Pieces",
  "Kitchenware",
  "Hand Railings",
  "Other",
];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const categoryRefs = useRef({});

  // ✅ Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getGallery();
        setImages(data);
      } catch (err) {
        console.error("Gallery fetch error:", err);
      }
    };
    fetchImages();
  }, []);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const showNext = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const showPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="gallery-page">
      <Navbar />

      <main className="gallery-main">
        <header className="gallery-header">
          <h1>Gallery</h1>
          <p>Browse our handcrafted collections by category.</p>
        </header>

        {categories.map((cat) => {
          const catImages = images.filter((img) => img.category === cat);
          if (!catImages.length) return null;

          return (
            <section
              key={cat}
              className="category-section"
              ref={(el) => (categoryRefs.current[cat] = el)}
            >
              <h2 className="category-title">{cat}</h2>

              <div className="images-grid">
                {catImages.map((img) => {
                  const globalIndex = images.findIndex((i) => i._id === img._id);

                  return (
                    <div
                      key={img._id}
                      className="image-card"
                      data-title={img.title || cat}
                      onClick={() => openLightbox(globalIndex)}
                    >
                      <img src={img.imageUrl} alt={img.title || cat} loading="lazy" />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              &times;
            </button>

            <button className="lightbox-prev" onClick={showPrev}>
              &#10094;
            </button>

            <img
              src={images[lightboxIndex].imageUrl}
              alt={images[lightboxIndex].title || "Image"}
            />

            {images[lightboxIndex].title && (
              <p className="lightbox-caption">{images[lightboxIndex].title}</p>
            )}

            <button className="lightbox-next" onClick={showNext}>
              &#10095;
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
