import axiosInstance from "./axiosInstance";


export const signup = async (userData) => {
  try {
    const response = await axiosInstance.post("auth/signup", userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante la registrazione"
    );
  }
};


export const login = async (userData) => {
  try {
    const response = await axiosInstance.post("auth/login", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Errore durante il login");
  }
};


export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("auth/forgot-password", {
      email,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Errore durante il recupero della password"
    );
  }
};


export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post(`auth/reset-password/${token}`, {
      password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante il reset della password"
    );
  }
};
