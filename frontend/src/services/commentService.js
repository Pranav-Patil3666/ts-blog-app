import axios from "axios";
import { getToken } from "@/utils/auth";

const commentApi = axios.create({
  baseURL: "http://localhost:5001/api/v1",
});

commentApi.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const extractMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

function normalizeComment(item) {
  return {
    id: item.id,
    comment: item.comment,
    userID: item.userid || item.userID,
    username: item.username,
    blogid: item.blogid,
    createdAt: item.createdat || item.createdAt,
  };
}

export async function getComments(blogId) {
  try {
    const { data } = await commentApi.get(`/comments/${blogId}`);
    return Array.isArray(data) ? data.map(normalizeComment) : [];
  } catch (error) {
    throw new Error(extractMessage(error, "Unable to load comments."));
  }
}

export async function addComment(blogId, comment) {
  try {
    const { data } = await commentApi.post("/comment", {
      comment,
      blogid: blogId,
    });

    return normalizeComment(data?.comment || data);
  } catch (error) {
    throw new Error(extractMessage(error, "Unable to add comment."));
  }
}
