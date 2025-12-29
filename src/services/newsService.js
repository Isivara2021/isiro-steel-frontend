import axios from "axios";

// Base URL of backend + news route
const API_URL = `${process.env.REACT_APP_API_URL}/api/news`;

/**
 * Fetch all news
 */
export const getAllNews = async () => {
  try {
    const res = await axios.get(API_URL);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Error fetching news:", err);
    return [];
  }
};

/**
 * Add a news item (Admin only)
 */
export const addNews = async (newsFormData) => {
  try {
    const res = await axios.post(API_URL, newsFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Error adding news:", err);
    throw err;
  }
};

/**
 * Update a news item by ID (Admin only)
 */
export const updateNews = async (id, newsFormData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, newsFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Error updating news:", err);
    throw err;
  }
};

/**
 * Delete a news item by ID (Admin only)
 */
export const deleteNews = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting news:", err);
    throw err;
  }
};
