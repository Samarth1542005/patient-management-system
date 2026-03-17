import axiosInstance from "./axiosInstance";

export const getMyDoctorProfile = () => axiosInstance.get("/doctors/me");
export const updateDoctorProfile = (data) => axiosInstance.patch("/doctors/me", data);
export const getAllDoctors = (params) => axiosInstance.get("/doctors", { params });
export const getDoctorStats = () => axiosInstance.get("/doctors/stats");
export const getMyProfile = () => axiosInstance.get("/doctors/me");
export const verifyNMC = (nmcNumber) => axiosInstance.post("/doctors/verify-nmc", { nmcNumber });