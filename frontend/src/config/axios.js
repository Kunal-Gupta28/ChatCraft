import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Not authenticated → redirect
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;