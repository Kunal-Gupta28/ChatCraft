import axiosInstance from "../config/axios";

export const loginUser = async (formData) => {
  const { data } = await axiosInstance.post(
    "/login",
    formData
  );

  return data;
};

export const registerUser = async (formData) => {
  const { data } = await axiosInstance.post(
    "/register",
    formData
  );

  return data;
};