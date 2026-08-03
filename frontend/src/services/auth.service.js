import axiosInstance from "../config/axios";

export const loginUser = async (formData) => {
  const { data } = await axiosInstance.post("/login", formData);
  return data;
};

export const registerUser = async (formData) => {
  const { data } = await axiosInstance.post("/register", formData);
  return data;
};

export const sendRegisterOTP = async (formData) => {
  const { data } = await axiosInstance.post("/send-register-otp", formData);
  return data;
};

export const verifyRegisterOTP = async (formData) => {
  const { data } = await axiosInstance.post("/verify-register-otp", formData);
  return data;
};

export const sendForgotOTP = async (formData) => {
  const { data } = await axiosInstance.post("/send-forgot-otp", formData);
  return data;
};

export const verifyForgotCode = async (formData) => {
  const { data } = await axiosInstance.post("/verify-forgot-code", formData);
  return data;
};

export const verifyForgotOTP = async (formData) => {
  const { data } = await axiosInstance.post("/verify-forgot-otp", formData);
  return data;
};

export const resetPassword = async (formData) => {
  const { data } = await axiosInstance.post("/forgot-password", formData);
  return data;
};