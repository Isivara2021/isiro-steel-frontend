// src/services/newsService.js

// Base URL of backend + news route
const API_URL = `${process.env.REACT_APP_API_URL}/api/news`;

/**
 * Fetch all news (User side)
 * @returns {Promise<Array>} array of news items
 */
export const getAllNews = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch news");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching news:", err);
    return [];
  }
};

/**
 * Add a news item (Admin only)
 * @param {FormData} newsFormData
 * @param {string} token - JWT from admin login
 */
export const addNews = async (newsFormData, token) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: newsFormData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add news");
    return data;
  } catch (err) {
    console.error("Error adding news:", err);
    throw err;
  }
};

/**
 * Update a news item by ID (Admin only)
 * @param {string} id
 * @param {FormData} newsFormData
 * @param {string} token
 */
export const updateNews = async (id, newsFormData, token) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: newsFormData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update news");
    return data;
  } catch (err) {
    console.error("Error updating news:", err);
    throw err;
  }
};

/**
 * Delete a news item by ID (Admin only)
 * @param {string} id
 * @param {string} token
 */
export const deleteNews = async (id, token) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete news");
    return data;
  } catch (err) {
    console.error("Error deleting news:", err);
    throw err;
  }
};
