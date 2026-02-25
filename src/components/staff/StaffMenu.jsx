import React, { useEffect, useState } from "react";
import {
  getStaffMenu,
  addStaffMenuItem,
  updateStaffMenuItem,
  deleteStaffMenuItem
} from "../../api/staff";
import {
  Modal,
  Form,
  OverlayTrigger,
  Tooltip,
  Toast,
  ToastContainer
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import "./StaffMenu.css";

const StaffMenu = () => {
  const [menu, setMenu] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "danger" });

  // ✅ Added rating field
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "MAIN",
    foodType: "VEG",
    available: true,
    imageUrl: "",
    rating: 0  // new field
  });

  const showToast = (message, type = "danger") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const fetchMenu = async () => {
    try {
      const res = await getStaffMenu();
      setMenu(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch menu");
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "MAIN",
      foodType: "VEG",
      available: true,
      imageUrl: "",
      rating: ""
    });
    setImagePreview(null);
    setEditingItem(null);
  };

  const validateForm = () => {
    const { name, price, rating } = formData;

    if (!name.trim()) {
      showToast("Name is required");
      return false;
    }
    if (price === "" || isNaN(price)) {
      showToast("Price must be a valid number");
      return false;
    }
    if (rating === "" || isNaN(rating) || rating < 0 || rating > 5) {
      showToast("Rating must be a number between 0 and 5");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingItem) {
        await updateStaffMenuItem(editingItem.id, formData);
        showToast("Menu item updated successfully", "success");
      } else {
        await addStaffMenuItem(formData);
        showToast("Menu item created successfully", "success");
      }
      setShowForm(false);
      resetForm();
      fetchMenu();
    } catch (err) {
      console.error(err);
      showToast("Failed to save menu item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?")) {
      try {
        await deleteStaffMenuItem(id);
        showToast("Menu item deleted successfully", "success");
        fetchMenu();
      } catch (err) {
        console.error(err);
        showToast("Failed to delete menu item");
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      foodType: item.foodType || "VEG",
      available: item.available,
      imageUrl: item.imageUrl || "",
      rating: item.rating != null ? String(item.rating) : ""
    });
    setImagePreview(item.imageUrl || null);
    setShowForm(true);
  };

  const handleImageUrlChange = (e) => {
    setFormData({ ...formData, imageUrl: e.target.value });
    setImagePreview(e.target.value);
  };

  return (
    <div className="admin-page-wrapper">
      <div className="admin-section">
        <div className="d-flex justify-content-between mb-4">
          <h4>Menu</h4>
          <div
            className="icon-action view"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <FaPlus />
          </div>
        </div>

        <div className="row g-4">
          {menu.map((item) => (
            <div key={item.id} className="col-md-3 g-4">
              <div className="order-card p-3 h-100">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="menu-image mb-2" />
                ) : (
                  <div className="menu-image-placeholder mb-2">
                    <FaImage size={32} />
                  </div>
                )}

                <h6>{item.name}</h6>
                <small>{item.description}</small>

                <div className="d-flex justify-content-between mt-2">
                  <strong>₹{item.price}</strong>
                  <span
                    className={`status-pill ${
                      item.available ? "completed" : "cancelled" 
                    }`}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>

                <small className="text-muted">
                  {item.category} •{" "}
                  <span
                    className={item.foodType === "VEG" ? "text-success" : "text-danger"}
                  >
                    {item.foodType}
                  </span>{" "}
                  • ⭐ {item.rating?.toFixed(1) ?? 0} {/* ✅ show rating */}
                </small>

                <div className="d-flex justify-content-end gap-3 mt-3">
                  <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                    <div className="icon-action view" onClick={() => handleEdit(item)}>
                      <FaEdit />
                    </div>
                  </OverlayTrigger>

                  <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                    <div
                      className="icon-action delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash />
                    </div>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        <Modal show={showForm} onHide={() => setShowForm(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingItem ? "Edit Item" : "Add Item"}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Control
                className="mb-2"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <Form.Control
                className="mb-2"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <Form.Control
                className="mb-2"
                type="number"
                step="any"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />

              {/* ✅ RATING FIELD */}
              <Form.Control
                className="mb-2"
                type="number"
                step="0.1"
                min={0}
                max={5}
                placeholder="Rating (0-5)"
                value={formData.rating }
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })
                }
              />

              <Form.Select
                className="mb-2"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="STARTER">Starter</option>
                <option value="MAIN">Main</option>
                <option value="DESSERT">Dessert</option>
              </Form.Select>

              <Form.Select
                className="mb-2"
                value={formData.foodType}
                onChange={(e) =>
                  setFormData({ ...formData, foodType: e.target.value })
                }
              >
                <option value="VEG">Veg</option>
                <option value="NON_VEG">Non-Veg</option>
              </Form.Select>

              <Form.Select
                className="mb-2"
                value={formData.available}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    available: e.target.value === "true"
                  })
                }
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </Form.Select>

              <Form.Control
                className="mb-2"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={handleImageUrlChange}
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="menu-image-preview mb-2"
                />
              )}

              <button className="btn btn-dark w-100 mt-3">
                {editingItem ? "Update" : "Create"}
              </button>
            </Form>
          </Modal.Body>
        </Modal>

        <ToastContainer position="top-end" className="p-3">
          <Toast
            show={toast.show}
            bg={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
            autohide
          >
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </div>
  );
};

export default StaffMenu;
