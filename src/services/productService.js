// src/services/productService.js

// Base URL of backend
const API_URL = process.env.REACT_APP_API_URL; // should include https://backend-url.com in production

// Get all products (public)
export const getProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
};

// Get single product by ID (public)
export const getProductById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    return await res.json();
  } catch (err) {
    console.error("Error fetching product:", err);
    return null;
  }
};

// Create a new product (admin only)
export const createProduct = async (formData, token) => {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create product");
    return data;
  } catch (err) {
    console.error("Error creating product:", err);
    throw err;
  }
};

// Update a product by ID (admin only)
export const updateProduct = async (id, formData, token) => {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update product");
    return data;
  } catch (err) {
    console.error("Error updating product:", err);
    throw err;
  }
};

// Delete a product by ID (admin only)
export const deleteProduct = async (id, token) => {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete product");
    return data;
  } catch (err) {
    console.error("Error deleting product:", err);
    throw err;
  }
};

// Remove a single image from a product (admin only)
export const removeProductImage = async (productId, imageIndex, token) => {
  try {
    const res = await fetch(
      `${API_URL}/products/${productId}/images/${imageIndex}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to remove image");
    return data;
  } catch (err) {
    console.error("Error removing product image:", err);
    throw err;
  }
};
