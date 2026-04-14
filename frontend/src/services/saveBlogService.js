import axios from "axios";
import { getToken } from "@/utils/auth";

const saveApi = axios.create({
  baseURL: "http://localhost:5001/api/v1",
});

saveApi.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const extractMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export async function getSavedBlogs(userId) {
  try {
    const { data } = await saveApi.get(`/saved/${userId}`);

    if (!Array.isArray(data)) return [];

    return data.map((item) => String(item.id));
  } catch (error) {
    throw new Error(extractMessage(error, "Unable to load saved blogs."));
  }
}

export async function toggleSaveBlog(blogId) {
  try {
    const { data } = await saveApi.post("/save", {
      blogid: blogId,
    });

    return data;
  } catch (error) {
    throw new Error(extractMessage(error, "Unable to update saved blog."));
  }
}