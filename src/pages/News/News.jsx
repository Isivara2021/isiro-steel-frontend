import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/Loader/Loader"; // ✅ Import Loader
import { getAllNews } from "../../services/newsService";
import "./News.css";

const API_URL = process.env.REACT_APP_API_URL;

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNews, setActiveNews] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize for responsive image previews
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchNews = async () => {
      try {
        const data = await getAllNews();
        setNewsList(data);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Close lightbox with Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setActiveNews(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const openLightbox = (news) => {
    setActiveNews(news);
    setActiveImageIndex(0);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? activeNews.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setActiveImageIndex((prev) =>
      prev === activeNews.images.length - 1 ? 0 : prev + 1
    );
  };

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${API_URL}${img}`;
  };

  return (
    <>
      <Navbar />

      <div className="news-page">
        <h1 className="news-title">Latest News</h1>

        {loading ? (
          <Loader text="Loading news..." />
        ) : (
          <div className="news-list">
            {newsList.map((news) => (
              <div
                key={news._id}
                className="news-card"
                onClick={() => openLightbox(news)}
              >
                <div className="news-images-preview">
                  {news.images?.map((img, idx) => {
                    // Show only first 3 images on mobile
                    if (isMobile && idx >= 3) return null;
                    // Show only first 5 images on desktop
                    if (!isMobile && idx >= 5) return null;

                    return (
                      <img
                        key={idx}
                        src={getImageUrl(img)}
                        alt={news.topic}
                        loading="lazy"
                      />
                    );
                  })}
                </div>

                <div className="news-content">
                  <h2>{news.topic}</h2>
                  <p className="preview-text preserve-lines">
                    {news.content.slice(0, 120)}...
                  </p>
                  <span className="news-date">
                    {new Date(news.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {activeNews && (
        <div className="news-lightbox" onClick={() => setActiveNews(null)}>
          <div
            className="news-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close"
              onClick={() => setActiveNews(null)}
            >
              ✕
            </button>

            <div className="lightbox-images">
              <button className="prev-image" onClick={prevImage}>
                ‹
              </button>

              <img
                src={getImageUrl(activeNews.images[activeImageIndex])}
                alt={activeNews.topic}
                loading="lazy"
              />

              <button className="next-image" onClick={nextImage}>
                ›
              </button>
            </div>

            <div className="lightbox-text">
              <h1>{activeNews.topic}</h1>
              <span className="news-date">
                {new Date(activeNews.date).toLocaleDateString()}
              </span>
              <p className="preserve-lines">{activeNews.content}</p>

              {activeNews.images.length > 1 && (
                <div className="lightbox-thumbnails">
                  {activeNews.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={getImageUrl(img)}
                      className={idx === activeImageIndex ? "active-thumb" : ""}
                      alt={`Thumbnail ${idx + 1}`}
                      loading="lazy"
                      onClick={() => setActiveImageIndex(idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default News;
