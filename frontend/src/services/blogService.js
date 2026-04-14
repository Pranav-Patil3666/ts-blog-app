import axios from "axios";
import { getToken } from "@/utils/auth";

const blogApi = axios.create({
  baseURL: import.meta.env.VITE_BLOG_SERVICE_URL || "http://localhost:5002/api/v1",
});

const authorApi = axios.create({
  baseURL: import.meta.env.VITE_AUTHOR_SERVICE_URL || "http://localhost:5001/api/v1",
});

const userApi = axios.create({
  baseURL: "http://localhost:5000/api/users",
});

authorApi.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const extractMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const normalizeAuthor = (authorId, author) => ({
  id: author?._id || authorId || "",
  name: author?.name || "Unknown author",
  image: author?.image || "",
  email: author?.email || "",
});

const normalizeBlog = (blog, author) => ({
  id: blog.id,
  title: blog.title,
  description: blog.description,
  content: blog.blogcontent,
  image: blog.image,
  category: blog.category,
  createdAt: blog.createdat || blog.createdAt,
  author: normalizeAuthor(blog.author, author),
});

async function getUserById(userId) {
  try {
    const { data } = await userApi.get(`/user/${userId}`);
    return data;
  } catch {
    return null;
  }
}

async function hydrateBlogsWithAuthors(blogs) {
  const authorIds = [...new Set(blogs.map((blog) => blog.author).filter(Boolean))];
  const authorEntries = await Promise.all(
    authorIds.map(async (authorId) => [authorId, await getUserById(authorId)])
  );
  const authorMap = new Map(authorEntries);

  return blogs.map((blog) => normalizeBlog(blog, authorMap.get(blog.author)));
}

export async function getAllBlogs(options = {}) {
  try {
    const { searchQuery = "", category = "" } = options;
    const { data } = await blogApi.get("/blogs/all", {
      params: { searchQuery, category },
    });

    return hydrateBlogsWithAuthors(data);
  } catch (error) {
    throw new Error(extractMessage(error, "Unable to load blogs right now."));
  }
}

export async function getSingleBlog(id) {
  try {
    const { data } = await blogApi.get(`/blogs/${id}`);

    if (data?.blog) {
      return normalizeBlog(data.blog, data.author);
    }

    throw new Error("Blog not found.");
  } catch (error) {
    throw new Error(extractMessage(error, "Unable to load this blog."));
  }
}

export async function createBlog(payload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("blogContent", payload.content);
  formData.append("Category", payload.category);
  formData.append("authorId", payload.authorId);

  if (payload.image) {
    formData.append("file", payload.image);
  }

  try {
    const { data } = await authorApi.post("/blog/new", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    throw new Error(
      extractMessage(
        error,
        "Unable to create your blog. Make sure title, description, category, content, and image are provided."
      )
    );
  }
}
