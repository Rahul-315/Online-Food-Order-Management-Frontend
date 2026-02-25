import React, { useEffect, useState, useCallback } from "react";
import {
  getMenuByRestaurant,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllRestaurants
} from "../../api/admin";
import { Modal, Form, OverlayTrigger, Tooltip, Toast, ToastContainer } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import "./AdminMenuItems.css";

const AdminMenuItems = ({ searchTerm }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ Add rating to form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "MAIN",
    foodType: "VEG",
    available: true,
    imageUrl: "",
    rating: 0 // ✅ NEW FIELD
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "danger" });

  const showToast = (message, type = "danger") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const restRes = await getAllRestaurants();
      setRestaurants(restRes.data);

      const selectedId = restaurantId || restRes.data[0]?.id;
      setRestaurantId(selectedId);

      if (selectedId) {
        const res = await getMenuByRestaurant(selectedId);
        setAllMenuItems(res.data);
        setMenuItems(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch data");
    }
    setLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!searchTerm) {
      setMenuItems(allMenuItems);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = allMenuItems.filter(item =>
      item.name?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term) ||
      item.foodType?.toLowerCase().includes(term) ||
      String(item.price).includes(term) ||
      String(item.rating).includes(term) // ✅ NEW: search by rating
    );
    setMenuItems(filtered);
  }, [searchTerm, allMenuItems]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "MAIN",
      foodType: "VEG",
      available: true,
      imageUrl: "",
      rating: 0 // ✅ NEW FIELD
    });
    setImagePreview(null);
  };

  const handleImageUrlChange = (e) => {
    setFormData({ ...formData, imageUrl: e.target.value });
    setImagePreview(e.target.value);
  };

  const validateForm = () => {
    const { name, price, category, foodType, imageUrl, rating } = formData;

    if (!name.trim()) {
      showToast("Item name is required");
      return false;
    }

    if (price === "" || isNaN(price)) {
      showToast("Price must be a valid number");
      return false;
    }

    if (!category || !foodType) {
      showToast("Category & Food Type are required");
      return false;
    }

    if (imageUrl && !isValidUrl(imageUrl)) {
      showToast("Invalid image URL");
      return false;
    }

    if (rating < 0 || rating > 5) { // ✅ NEW: validate rating
      showToast("Rating must be between 0 and 5");
      return false;
    }

    return true;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, { ...formData, restaurantId });
        showToast("Menu item updated successfully", "success");
      } else {
        await createMenuItem(restaurantId, formData);
        showToast("Menu item created successfully", "success");
      }
      setShowForm(false);
      setEditingItem(null);
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      showToast("Failed to save menu item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this menu item?")) {
      try {
        await deleteMenuItem(id);
        showToast("Menu item deleted successfully", "success");
        fetchData();
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
      rating: item.rating || 0 // ✅ NEW FIELD
    });
    setImagePreview(item.imageUrl || null);
    setShowForm(true);
  };

  return (
    <div className="admin-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Menu Items</h3>
        <div
          className="icon-action view"
          onClick={() => {
            resetForm();
            setEditingItem(null);
            setShowForm(true);
          }}
        >
          <FaPlus />
        </div>
      </div>

      <Form.Select
        className="mb-4"
        style={{ maxWidth: "320px" }}
        value={restaurantId}
        onChange={(e) => setRestaurantId(e.target.value)}
      >
        {restaurants.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </Form.Select>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="row g-2">
          {menuItems.map(item => (
            <div key={item.id} className="col-md-2">
              <div className="card order-card shadow-sm p-3 h-100">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="menu-image mb-2" />
                ) : (
                  <div className="menu-image-placeholder mb-2">
                    <FaImage size={32} />
                  </div>
                )}

                <h6 className="fw-bold">{item.name}</h6>
                <p className="text-muted small">{item.description}</p>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">₹{item.price}</span>
                  <span className={`status-pill ${item.available ? "completed" : "cancelled"}`}>
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>

                <small className="text-muted">
                  {item.category} •{" "}
                  <span className={item.foodType === "VEG" ? "text-success" : "text-danger"}>
                    {item.foodType}
                  </span>{" "}
                  • ⭐ {item.rating?.toFixed(1) || 0} {/* ✅ NEW */}
                </small>

                <div className="d-flex justify-content-end gap-3 mt-3">
                  <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                    <div className="icon-action view" onClick={() => handleEdit(item)}>
                      <FaEdit />
                    </div>
                  </OverlayTrigger>

                  <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                    <div className="icon-action delete" onClick={() => handleDelete(item.id)}>
                      <FaTrash />
                    </div>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Control
              className="mb-2"
              placeholder="Item Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Form.Control
              className="mb-2"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Form.Control
              className="mb-2"
              type="number"
              placeholder="Price *"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />

            <Form.Select
              className="mb-2"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="STARTER">Starter</option>
              <option value="MAIN">Main Course</option>
              <option value="DESSERT">Dessert</option>
            </Form.Select>

            <Form.Select
              className="mb-2"
              value={formData.foodType}
              onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
            >
              <option value="VEG">Veg</option>
              <option value="NON_VEG">Non-Veg</option>
            </Form.Select>

            <Form.Select
              className="mb-2"
              value={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.value === "true" })}
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

            {/* ✅ NEW RATING FIELD */}
            <Form.Control
              className="mb-2"
              type="number"
              placeholder="Rating (0 - 5)"
              min={0}
              max={5}
              step={0.1}
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseFloat(e.target.value) })
              }
            />

            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="menu-image-preview mb-2" />
            )}

            <button className="btn btn-dark w-100 mt-2">
              {editingItem ? "Update Item" : "Create Item"}
            </button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={toast.show} bg={toast.type} onClose={() => setToast({ ...toast, show: false })} autohide>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default AdminMenuItems;
