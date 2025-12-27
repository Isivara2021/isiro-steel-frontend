import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getAllNews = async () => {
  try {
    const res = await axios.get(API_URL);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const addNews = async (newsFormData) => {
  try {
    const res = await axios.post(API_URL, newsFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const updateNews = async (id, newsFormData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, newsFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const deleteNews = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
