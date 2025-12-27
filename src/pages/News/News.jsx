import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { getAllNews } from "../../services/newsService";
import "./News.css";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [activeNews, setActiveNews] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchNews = async () => {
      const data = await getAllNews();
      setNewsList(data);
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

  return (
    <>
      <Navbar />

      <div className="news-page">
        <h1 className="news-title">Latest News</h1>

        <div className="news-list">
          {newsList.map((news) => (
            <div
              key={news._id}
              className="news-card"
              onClick={() => openLightbox(news)}
            >
              <div className="news-images-preview">
                {news.images?.slice(0, 3).map((img, idx) => (
                  <img key={idx} src={img} alt={news.topic} />
                ))}
              </div>

              <div className="news-content">
                <h2>{news.topic}</h2>
                <p>{news.content.slice(0, 120)}...</p>
                <span className="news-date">
                  {new Date(news.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX */}
      {activeNews && (
        <div className="news-lightbox" onClick={() => setActiveNews(null)}>
          <div
            className="news-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
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
                src={activeNews.images[activeImageIndex]}
                alt={activeNews.topic}
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
              <p>{activeNews.content}</p>

              {activeNews.images.length > 1 && (
                <div className="lightbox-thumbnails">
                  {activeNews.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      className={idx === activeImageIndex ? "active-thumb" : ""}
                      alt={`Thumbnail ${idx + 1}`}
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
