import axiosInstance from "./axiosInstance";

export const signup = (data) => axiosInstance.post("/auth/signup", data);
export const login = (data) => axiosInstance.post("/auth/login", data);
export const logout = () => axiosInstance.post("/auth/logout");