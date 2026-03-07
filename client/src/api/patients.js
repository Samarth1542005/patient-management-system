import axiosInstance from "./axiosInstance";

export const getMyProfile = () => axiosInstance.get("/patients/me");
export const updateMyProfile = (data) => axiosInstance.patch("/patients/me", data);
export const getAllPatients = (params) => axiosInstance.get("/patients", { params });
export const getPatientById = (id) => axiosInstance.get(`/patients/${id}`);
export const getPatientHistory = (id) => axiosInstance.get(`/patients/${id}/history`);
export const addMedicalHistory = (id, data) => axiosInstance.post(`/patients/${id}/medical-history`, data);
export const addVitalSigns = (id, data) => axiosInstance.post(`/patients/${id}/vitals`, data);