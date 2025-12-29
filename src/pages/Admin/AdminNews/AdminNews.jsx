import React, { useState, useEffect, useContext, useRef } from "react";
import { AdminContext } from "../../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { compressImage } from "../../../utils/imageCompression";
import "./AdminNews.css";

const MAX_TOPIC_LENGTH = 100;
const MAX_CONTENT_LENGTH = 2000;
const MAX_IMAGES = 5;

// ✅ Base backend URL (NO /api here)
const API_URL = process.env.REACT_APP_API_URL;

const AdminNews = () => {
  const { admin } = useContext(AdminContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [newsList, setNewsList] = useState([]);
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     AUTH GUARD
  ========================== */
  useEffect(() => {
    if (!admin?.token) navigate("/admin/login");
  }, [admin, navigate]);

  /* =========================
     FETCH NEWS
  ========================== */
  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/news`);
      setNewsList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch failed:", err);
      alert("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  /* =========================
     RESET FORM
  ========================== */
  const resetForm = () => {
    setTopic("");
    setContent("");
    setNewImages([]);
    setExistingImages([]);
    setRemovedImages([]);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  /* =========================
     HANDLE IMAGE SELECT
  ========================== */
  const handleNewImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    const total = existingImages.length + newImages.length + files.length;

    if (total > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed.`);
      e.target.value = null;
      return;
    }

    try {
      setLoading(true);
      const compressed = await Promise.all(files.map((f) => compressImage(f)));
      setNewImages((prev) => [...prev, ...compressed]);
    } catch (err) {
      console.error("Compression failed:", err);
      alert("Image processing failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SUBMIT (ADD / UPDATE)
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin?.token) return alert("Unauthorized");

    if (!topic.trim() || !content.trim())
      return alert("Topic and content are required");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("topic", topic);
      formData.append("content", content);
      newImages.forEach((img) => formData.append("images", img));
      if (removedImages.length) {
        formData.append("removedImages", JSON.stringify(removedImages));
      }

      const config = {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      };

      if (editingId) {
        await axios.put(`${API_URL}/api/news/${editingId}`, formData, config);
      } else {
        await axios.post(`${API_URL}/api/news`, formData, config);
      }

      resetForm();
      fetchNews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EDIT / DELETE
  ========================== */
  const handleEdit = (news) => {
    setTopic(news.topic);
    setContent(news.content);
    setExistingImages(news.images || []);
    setRemovedImages([]);
    setNewImages([]);
    setEditingId(news._id);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news item?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/news/${id}`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      fetchNews();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     IMAGE REMOVE
  ========================== */
  const removeNewImage = (i) =>
    setNewImages((prev) => prev.filter((_, idx) => idx !== i));

  const removeExistingImage = (i) => {
    setRemovedImages((prev) => [...prev, existingImages[i]]);
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  /* =========================
     UI
  ========================== */
  if (!admin) return null;

  return (
    <div className="admin-news-page-wrapper">
      <div className="admin-news-page">
        <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
          ← Back to Dashboard
        </button>

        <h1>Manage News</h1>

        <form className="news-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={`Topic (max ${MAX_TOPIC_LENGTH})`}
            value={topic}
            maxLength={MAX_TOPIC_LENGTH}
            onChange={(e) => setTopic(e.target.value)}
            required
          />

          <textarea
            placeholder={`Content (max ${MAX_CONTENT_LENGTH})`}
            value={content}
            maxLength={MAX_CONTENT_LENGTH}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleNewImageSelect}
          />

          <small>
            {existingImages.length + newImages.length} / {MAX_IMAGES} images
          </small>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="image-preview">
              {existingImages.map((img, i) => (
                <div key={i} className="image-thumb">
                  <img src={img} alt="" />
                  <button type="button" onClick={() => removeExistingImage(i)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Images */}
          {newImages.length > 0 && (
            <div className="image-preview">
              {newImages.map((img, i) => (
                <div key={i} className="image-thumb">
                  <img src={URL.createObjectURL(img)} alt="" />
                  <button type="button" onClick={() => removeNewImage(i)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : editingId ? "Update News" : "Add News"}
          </button>
        </form>

        {/* NEWS LIST */}
        <div className="news-list">
          {newsList.length ? (
            newsList.map((n) => (
              <div key={n._id} className="news-card">
                <h3>{n.topic}</h3>
                <p>{n.content}</p>

                {n.images?.length > 0 && (
                  <div className="news-card-images">
                    {n.images.map((img, i) => (
                      <img key={i} src={img} alt="" />
                    ))}
                  </div>
                )}

                <div className="news-card-actions">
                  <button onClick={() => handleEdit(n)}>Edit</button>
                  <button onClick={() => handleDelete(n._id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No news available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNews;
