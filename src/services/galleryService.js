// src/services/galleryService.js

// Base URL of your backend (uses environment variable for deployment)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Fetch all gallery images
 * @returns {Promise<Array>} array of gallery image objects
 */
export const getGallery = async () => {
  try {
    const res = await fetch(`${API_URL}/api/gallery`);
    if (!res.ok) throw new Error("Failed to fetch gallery");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching gallery:", err);
    return [];
  }
};

/**
 * Fetch gallery images by category
 * @param {string} category
 * @returns {Promise<Array>} filtered images
 */
export const getGalleryByCategory = async (category) => {
  try {
    const allImages = await getGallery();
    return allImages.filter((img) => img.category === category);
  } catch (err) {
    console.error("Error fetching gallery by category:", err);
    return [];
  }
};

/**
 * Add a new gallery image (Admin only)
 * @param {FormData} formData
 * @param {string} token - JWT from admin login
 */
export const addGalleryImage = async (formData, token) => {
  try {
    const res = await fetch(`${API_URL}/api/gallery`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add image");
    return data;
  } catch (err) {
    console.error("Error adding gallery image:", err);
    throw err;
  }
};

/**
 * Delete a gallery image by ID (Admin only)
 * @param {string} id
 * @param {string} token - JWT from admin login
 */
export const deleteGalleryImage = async (id, token) => {
  try {
    const res = await fetch(`${API_URL}/api/gallery/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete image");
    return data;
  } catch (err) {
    console.error("Error deleting gallery image:", err);
    throw err;
  }
};
