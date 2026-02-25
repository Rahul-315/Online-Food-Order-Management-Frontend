import React, { useEffect, useState } from "react";

import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from "../../api/admin";

import { Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";

import { FaTrash, FaEye } from "react-icons/fa";
import { FaBoxArchive } from "react-icons/fa6";

import "./AdminOrders.css";

const AdminOrders = ({ searchTerm }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("ACTIVE");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showView, setShowView] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status);
    fetchOrders();
  };

  const confirmDelete = async () => {
    await deleteOrder(deleteId);
    setShowDelete(false);
    fetchOrders();
  };

  const filteredOrders = orders
    .filter(o =>
      view === "ARCHIVED"
        ? o.status === "COMPLETED"
        : o.status !== "COMPLETED"
    )
    .filter(o => {
      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();

      const customerName =
        o.customer?.username?.toLowerCase() || "";

      const restaurantName =
        o.restaurant?.name?.toLowerCase() || "";

      const status = o.status?.toLowerCase() || "";
      const amount = String(o.totalAmount || "");
      const id = String(o.id || "");

      return (
        customerName.includes(term) ||
        restaurantName.includes(term) ||
        status.includes(term) ||
        amount.includes(term) ||
        id.includes(term)
      );
    });

  return (
    <div className="admin-section fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-semibold">Orders</h4>

        <div className="d-flex gap-3">
          <span
            className={`icon-action ${view === "ACTIVE" ? "view" : ""}`}
            onClick={() => setView("ACTIVE")}
          >
            Active
          </span>

          <span
            className={`icon-action ${
              view === "ARCHIVED" ? "export" : ""
            }`}
            onClick={() => setView("ARCHIVED")}
          >
            <FaBoxArchive />
          </span>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="row g-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="col-md-4">
              <div className="card order-card shadow-sm p-3 h-100">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="fw-bold">Order #{order.id}</h6>
                    <small className="text-muted">
                      {new Date(order.orderTime).toLocaleString()}
                    </small>
                  </div>

                  <span className={`status-pill ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <hr />

                <p><strong>Customer:</strong> {order.customer?.username}</p>
                <p><strong>Restaurant:</strong> {order.restaurant?.name}</p>
                <p className="fw-semibold">₹{order.totalAmount}</p>

                {view === "ACTIVE" && (
                  <Form.Select
                    size="sm"
                    className="mb-3"
                    value={order.status}
                    onChange={e =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Form.Select>
                )}

                <div className="d-flex gap-3 justify-content-end">
                  <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
                    <div
                      className="icon-action view"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowView(true);
                      }}
                    >
                      <FaEye />
                    </div>
                  </OverlayTrigger>

                  {view === "ARCHIVED" && (
                    <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                      <div
                        className="icon-action delete"
                        onClick={() => {
                          setDeleteId(order.id);
                          setShowDelete(true);
                        }}
                      >
                        <FaTrash />
                      </div>
                    </OverlayTrigger>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={showView} onHide={() => setShowView(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p><strong>ID:</strong> {selectedOrder.id}</p>
              <p><strong>Customer:</strong> {selectedOrder.customer?.username}</p>
              <p><strong>Restaurant:</strong> {selectedOrder.restaurant?.name}</p>
              <p><strong>Total:</strong> ₹{selectedOrder.totalAmount}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This will permanently remove the archived order.
        </Modal.Body>
        <Modal.Footer>
          <span className="icon-action delete" onClick={confirmDelete}>
            <FaTrash /> Confirm
          </span>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminOrders;
