import api from "./api";

// Public
export const getAllRestaurants = () => api.get("/restaurants");
export const getMenuByRestaurant = (restaurantId) =>
  api.get(`/menu?restaurantId=${restaurantId}`);

// Cart
export const getCart = () => api.get("/customer/cart");
export const addToCart = (menuItemId, quantity) =>
  api.post(`/customer/cart?menuItemId=${menuItemId}&quantity=${quantity}`);
export const removeFromCart = (cartItemId) =>
  api.delete(`/customer/cart/${cartItemId}`);

// Orders
export const placeOrder = (deliveryAddress) => {
  if (deliveryAddress) {
    return api.post(
      `/customer/order?deliveryAddress=${encodeURIComponent(deliveryAddress)}`
    );
  }
  return api.post("/customer/order");
};

export const getMyOrders = () => api.get("/customer/orders");
export const deleteOrder = (orderId) =>
  api.delete(`/customer/orders/${orderId}`);

// Profile
export const getMyProfile = () => api.get("/customer/profile");
export const updateMyProfile = (data) =>
  api.put("/customer/profile", data);
export const registerPartnerRestaurant = (data) =>
  api.post("/partner/register", data);
