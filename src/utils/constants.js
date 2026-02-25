export const API_BASE_URL = "http://localhost:8080/api";
export const ROLES = Object.freeze({
  ADMIN: "ADMIN",
  STAFF: "RESTAURANT_STAFF",
  CUSTOMER: "CUSTOMER",
});

export const ROLES_ARRAY = Object.freeze([
  { value: ROLES.ADMIN, label: "Admin" },
  { value: ROLES.STAFF, label: "Restaurant Staff" },
  { value: ROLES.CUSTOMER, label: "Customer" },
]);
export const FOOD_CATEGORIES = Object.freeze({
  STARTER: "STARTER",
  MAIN: "MAIN",
  DESSERT: "DESSERT",
});

export const FOOD_CATEGORIES_ARRAY = Object.freeze([
  { value: FOOD_CATEGORIES.STARTER, label: "Starter" },
  { value: FOOD_CATEGORIES.MAIN, label: "Main Course" },
  { value: FOOD_CATEGORIES.DESSERT, label: "Dessert" },
]);
export const ORDER_STATUS = Object.freeze({
   NEW: "NEW",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
});

export const ORDER_STATUS_ARRAY = Object.freeze([
   { value: ORDER_STATUS.NEW, label: "New" },      
  { value: ORDER_STATUS.PENDING, label: "Pending" },
  { value: ORDER_STATUS.COMPLETED, label: "Completed" },
  { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
]);
