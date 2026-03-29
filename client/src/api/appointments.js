import axiosInstance from "./axiosInstance";

export const bookAppointment = (data) => axiosInstance.post("/appointments", data);
export const getMyAppointments = () => axiosInstance.get("/appointments/my");
export const getDoctorAppointments = (params) => axiosInstance.get("/appointments", { params });
export const updateAppointmentStatus = (id, data) => axiosInstance.patch(`/appointments/${id}/status`, data);
export const cancelAppointment = (id) => axiosInstance.patch(`/appointments/${id}/cancel`);
export const suggestSlots = (id, data) => axiosInstance.post(`/appointments/${id}/suggest-slots`, data);