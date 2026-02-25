// src/components/customer/CustomerOrders.jsx
import React, { useEffect, useState } from "react";
import { getMyOrders, deleteOrder } from "../../api/customer";
import { Toast, ToastContainer } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import { isAuthenticated } from "../../auth/auth";
import "./CustomerOrders.css";

const CustomerOrders = ({ searchQuery = "" }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { setOrdersCount } = useCart();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (!isAuthenticated()) {
        showToast("Please login to view your orders", "danger");
        setOrders([]);
        return;
      }

      const res = await getMyOrders();
      setOrders(res.data);
      setOrdersCount(res.data.length);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch orders", "danger");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toString().includes(searchQuery) ||
      o.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.restaurant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.deliveryAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(orderId);
      showToast("Order deleted successfully", "success");
      fetchOrders();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete order", "danger");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "new":
        return "#2196f3";
      case "pending":
        return "#ff9800";
      case "completed":
        return "#4caf50";
      case "cancelled":
        return "#f44336";
      default:
        return "#777";
    }
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (!filteredOrders.length)
    return <div className="text-center mt-4">No orders yet.</div>;

  return (
    <div className="container mt-4">
      <h4 className="mb-3">My Orders</h4>

      <div className="row g-3">
        {filteredOrders.map((o, i) => {
          // ✅ ONLY CHANGE: customer can delete ONLY when order is NEW
          const isDeletable = o.status.toLowerCase() === "new" || o.status.toLowerCase() === "cancelled"|| o.status.toLowerCase() === "completed";

          return (
            <div key={o.id} className="col-md-6 col-sm-12">
              <div
                className="card p-3 shadow-sm h-100 fade-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6>Order #{o.id}</h6>
                  <span
                    className="badge"
                    style={{ background: getStatusColor(o.status) }}
                  >
                    {o.status}
                  </span>
                </div>

                <p>
                  <strong>Restaurant:</strong>{" "}
                  {o.restaurant ? o.restaurant.name : "Unknown"}
                </p>

                <p>
                  <strong>Delivery Address:</strong>{" "}
                  {o.deliveryAddress || "Not provided"}
                </p>

                <p>
                  <strong>Items:</strong>{" "}
                  {o.orderItems?.length
                    ? o.orderItems.map((i) => i.menuItem.name).join(", ")
                    : "No items"}
                </p>

                <p>
                  <strong>Total:</strong> ₹{o.totalAmount.toFixed(2)}
                </p>

                <small>{new Date(o.orderTime).toLocaleString()}</small>

                {isDeletable && (
                  <button
                    className="btn btn-danger mt-3"
                    onClick={() => handleDelete(o.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          bg={toast.type}
          delay={3000}
          autohide
          onClose={() => setToast({ ...toast, show: false })}
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default CustomerOrders;
