import React, { useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  addToCart,
  placeOrder,
} from "../../api/customer";
import { useCart } from "../../context/CartContext";
import { isAuthenticated } from "../../auth/auth";
import { Toast, ToastContainer } from "react-bootstrap";
import "./CustomerCart.css";

const CustomerCart = ({ searchQuery = "" }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "danger",
  });

  const [deliveryAddress, setDeliveryAddress] = useState("");

  const { incrementOrders } = useCart();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const filteredCartItems =
    cart?.cartItems.filter((item) =>
      item.menuItem.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const showToast = (message, type = "danger") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuantityChange = async (item, delta) => {
    try {
      const newQty = Math.max(1, item.quantity + delta);
      await removeFromCart(item.id);
      await addToCart(item.menuItem.id, newQty);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated()) {
      showToast("Please login to place your order!", "danger");
      return;
    }

    /* ================= ADDRESS VALIDATION (NEW) ================= */
    if (deliveryAddress.trim()) {
      const address = deliveryAddress.trim();

      if (address.length < 10) {
        showToast("Address is too short. Please enter full address.");
        return;
      }

      const addressRegex = /[a-zA-Z]/.test(address) && /\d/.test(address);
      if (!addressRegex) {
        showToast(
          "Please enter a valid address with house/flat number."
        );
        return;
      }
    }
    /* ============================================================ */

    if (cart && cart.cartItems.length > 1) {
      const restaurantIds = new Set(
        cart.cartItems.map((item) => item.menuItem.restaurant.id)
      );
      if (restaurantIds.size > 1) {
        showToast(
          "Your cart contains items from multiple restaurants!",
          "danger"
        );
        return;
      }
    }

    try {
      setPlacingOrder(true);

      await placeOrder(
        deliveryAddress.trim() ? deliveryAddress.trim() : undefined
      );

      incrementOrders();
      showToast("Order placed successfully!", "success");
      fetchCart();
      setDeliveryAddress("");
    } catch (err) {
      console.error(err);
      showToast("Failed to place order", "danger");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading)
    return <div className="text-center mt-4">Loading your cart...</div>;

  if (!cart || filteredCartItems.length === 0)
    return (
      <div className="empty-cart">
        <img
          src="https://source.unsplash.com/300x200/?empty-cart,food"
          alt="Empty Cart"
        />
        <h5>Your cart is empty</h5>
        <p>Add some delicious items to start your order!</p>
      </div>
    );

  return (
    <div className="cart-page container-fluid">
      <div className="cart-container row">
        <div className="cart-items col-lg-8 col-md-12">
          <h4>Your Cart</h4>

          {cart.cartItems.length > 0 && (
            <div className="restaurant-name-card mb-3 p-2 shadow-sm rounded">
              <strong>Restaurant:</strong>{" "}
              {cart.cartItems[0].menuItem.restaurant.name}
            </div>
          )}

          {filteredCartItems.map((item) => (
            <div key={item.id} className="cart-item-card fade-slide-up mb-3">
              <img
                src={
                  item.menuItem.imageUrl ||
                  "https://source.unsplash.com/120x100/?food"
                }
                alt={item.menuItem.name}
                className="cart-item-img"
              />

              <div className="cart-item-details">
                <h6>{item.menuItem.name}</h6>
                <p>{item.menuItem.description}</p>

                <div className="cart-item-qty-price d-flex justify-content-between">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item, -1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item, 1)}>
                      +
                    </button>
                  </div>
                  <span>
                    ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                className="btn btn-danger btn-remove"
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-sidebar col-lg-4 col-md-12 mt-4 mt-lg-0">
          <div className="total-card shadow-sm p-3 rounded">
            <h5>Order Summary</h5>

            <div className="subtotal d-flex justify-content-between">
              <span>Subtotal:</span>
              <span>₹{cart.totalAmount.toFixed(2)}</span>
            </div>

            <div className="delivery-address mt-3">
              <h6>Delivery Address</h6>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter delivery address (leave empty to use registered address)"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
              <small className="text-muted">
                If left empty, your registered address will be used.
              </small>
            </div>

            <div className="payment-method mt-3">
              <h6>Payment Method</h6>
              <div className="form-check">
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="form-check-input"
                />
                <label className="form-check-label">
                  Cash on Delivery
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="form-check-input"
                />
                <label className="form-check-label">
                  Card Payment
                </label>
              </div>
            </div>

            <button
              className="btn btn-orange mt-3 w-100"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={toast.show} bg={toast.type}>
          <Toast.Body className="text-white">
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default CustomerCart;
