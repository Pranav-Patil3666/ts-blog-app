import axios from "axios";
import { clearAuthSession, getToken, setAuthSession, updateStoredUser } from "@/utils/auth";

const api = axios.create({
  baseURL: "http://localhost:5000/api/users",
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession();
    }

    return Promise.reject(error);
  }
);

const extractMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export async function loginWithGoogle(code) {
  try {
    const { data } = await api.post("/login", { code });
    setAuthSession(data.token, data.user);
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, "Unable to login right now."));
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await api.get("/me");
    updateStoredUser(data);
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, "Unable to load your profile."));
  }
}

export async function updateUserProfile(payload) {
  try {
    const { data } = await api.post("/user/update", payload);
    setAuthSession(data.token || getToken(), data.user);
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, "Unable to update your profile."));
  }
}

export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await api.post("/update/pic", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setAuthSession(data.token || getToken(), data.user);
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, "Unable to update your profile image."));
  }
}

export default api;
