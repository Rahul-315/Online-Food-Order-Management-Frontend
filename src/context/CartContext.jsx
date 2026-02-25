import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  // existing cart logic (UNCHANGED)
  const incrementCart = (count = 1) => {
    setCartCount(prev => prev + count);
  };

  const resetCart = () => {
    setCartCount(0);
  };

  // existing order increment (UNCHANGED)
  const incrementOrders = () => {
    setOrderCount(prev => prev + 1);
  };

  // ✅ NEW: sync orders count from backend
  const setOrdersCount = (count) => {
    setOrderCount(count);
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        orderCount,
        incrementCart,
        resetCart,
        incrementOrders,
        setOrdersCount, // 👈 ADD ONLY THIS
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
