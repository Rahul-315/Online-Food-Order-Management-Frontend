import React, { useEffect, useState } from "react";
import { getStaffOrders, updateStaffOrderStatus } from "../../api/staff";
import { Form } from "react-bootstrap";
import "./StaffOrders.css";

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState(null);

  const fetchOrders = async () => {
    const res = await getStaffOrders();
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await updateStaffOrderStatus(id, status);
    setRecentlyUpdated(id);
    fetchOrders();
    setTimeout(() => setRecentlyUpdated(null), 1000);
  };

  const getCardClass = (order) => {
    let baseClass = "order-card";
    const statusLower = order.status.toLowerCase();
    baseClass += ` ${statusLower}`;
    if (recentlyUpdated === order.id) baseClass += ` updated ${statusLower}`;
    return baseClass;
  };

  return (
    <div className="admin-section">
      <h4 className="mb-3">Orders</h4>

      <div className="row g-4">
        {orders.map((order) => (
          <div key={order.id} className="col-md-4">
            <div className={getCardClass(order)}>
              <h6>Order #{order.id}</h6>
              <small>{new Date(order.orderTime).toLocaleString()}</small>

              {/* ✅ Restaurant Name */}
              <p className="mt-2">
                <strong>Restaurant:</strong>{" "}
                {order.restaurant?.name || "Unknown"}
              </p>

              {/* ✅ Delivery Address Snapshot */}
              <p>
                <strong>Delivery Address:</strong>{" "}
                {order.deliveryAddress || "Not available"}
              </p>

              <p>
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>

              <Form.Select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Form.Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffOrders;
