import api from "./api"; 
export const getAllUsers = async () => await api.get("/admin/users");
export const createUser = async (data) => await api.post("/admin/users", data);
export const updateUser = async (id, data) => await api.put(`/admin/users/${id}`, data);
export const deleteUser = async (id) => await api.delete(`/admin/users/${id}`);
export const getAllRestaurants = async () => await api.get("/admin/restaurants");
export const createRestaurant = async (data) => await api.post("/admin/restaurants", data);
export const updateRestaurant = async (id, data) => await api.put(`/admin/restaurants/${id}`, data);
export const deleteRestaurant = async (id) => await api.delete(`/admin/restaurants/${id}`);
export const getMenuByRestaurant = async (restaurantId) =>
  await api.get(`/admin/menu?restaurantId=${restaurantId}`);
export const createMenuItem = async (restaurantId, data) =>
  await api.post(`/admin/menu?restaurantId=${restaurantId}`, data);
export const updateMenuItem = async (id, data) => await api.put(`/admin/menu/${id}`, data);
export const deleteMenuItem = async (id) => await api.delete(`/admin/menu/${id}`);
export const getAllOrders = async () => await api.get("/admin/orders");

export const getOrderById = async (id) =>
  await api.get(`/admin/orders/${id}`);

export const updateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}/status?status=${status}`);

export const updateOrder = async (id, data) =>
  await api.put(`/admin/orders/${id}`, data);  

export const deleteOrder = async (id) =>
  await api.delete(`/admin/orders/${id}`);

export const createOrder = async (data) =>
  await api.post("/admin/orders", data);

export const getPartnerRestaurantRequests = () =>
  api.get("/admin/partner-restaurants");
export const approvePartnerRestaurant = (id) =>
  api.post(`/admin/partner-restaurants/${id}/approve`);
export const rejectPartnerRestaurant = (id) =>
  api.post(`/admin/partner-restaurants/${id}/reject`);
// ✅ Partner Restaurant Requests
export const deletePartnerRestaurantRequest = (id) =>
  api.delete(`/admin/partner-restaurants/${id}`);
