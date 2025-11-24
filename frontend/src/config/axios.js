import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

// attach token on each request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// handle errors globally
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    // token expired / invalid
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // server down / no internet
    if (err.code === "ERR_NETWORK") {
      console.error("Network error:", err.message);
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
