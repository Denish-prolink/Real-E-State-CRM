import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach access token ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── Response interceptor: auto-logout on 401 ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If any API returns 401 (token expired/invalid) → force logout
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("auth/login") &&
      !error.config?.url?.includes("auth/register")
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Redirect to login if not already there
      const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
      if (!publicPaths.some((p) => window.location.pathname.startsWith(p))) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;