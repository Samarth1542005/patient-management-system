import axiosInstance from "./axiosInstance";

export const createPrescription = (data) => axiosInstance.post("/prescriptions", data);
export const getMyPrescriptions = () => axiosInstance.get("/prescriptions/my");
export const getPrescriptionById = (id) => axiosInstance.get(`/prescriptions/${id}`);
export const getPatientPrescriptions = (patientId) => axiosInstance.get(`/prescriptions/patient/${patientId}`);