import api from "./api";
export const getStaffMenu = () => api.get("/staff/menu");
export const addStaffMenuItem = (data) => api.post("/staff/menu", data);
export const updateStaffMenuItem = (id, data) => api.put(`/staff/menu/${id}`, data);
export const deleteStaffMenuItem = (id) => api.delete(`/staff/menu/${id}`);
export const getStaffOrders = () => api.get("/staff/orders");
export const updateStaffOrderStatus = (id, status) =>
  api.put(`/staff/orders/${id}/status?status=${status}`);
