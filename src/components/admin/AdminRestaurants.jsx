import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaStore,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaImage,
} from "react-icons/fa";
import {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../../api/admin";
import { Toast, ToastContainer } from "react-bootstrap";
import "./AdminRestaurants.css";

const AdminRestaurants = ({ searchTerm }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    description: "",
    imageUrl: "",
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "danger" });

  const showToast = (message, type = "danger") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await getAllRestaurants();
      setRestaurants(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch restaurants");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const openAddModal = () => {
    setEditingRestaurant(null);
    setFormData({
      name: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
      description: "",
      imageUrl: "",
    });
    setImagePreview(null);
    setShowModal(true);
    document.body.classList.add("modal-open");
  };

  const openEditModal = (restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData(restaurant);
    setImagePreview(restaurant.imageUrl || null);
    setShowModal(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.classList.remove("modal-open");
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    setImagePreview(url);
  };

  const validateForm = () => {
    const { name, address, contactEmail, contactPhone, imageUrl } = formData;

    if (!name.trim() || !address.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      showToast("Please fill all required fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      showToast("Invalid email format");
      return false;
    }

    const phoneRegex = /^[7-9][0-9]{9}$/;
    if (!phoneRegex.test(contactPhone)) {
      showToast("Invalid phone number. Must be 10 digits starting with 7, 8, or 9");
      return false;
    }

    if (imageUrl && !isValidUrl(imageUrl)) {
      showToast("Invalid image URL");
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
      if (editingRestaurant) {
        await updateRestaurant(editingRestaurant.id, formData);
        showToast("Restaurant updated successfully", "success");
      } else {
        await createRestaurant(formData);
        showToast("Restaurant created successfully", "success");
      }
      closeModal();
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      showToast("Failed to save restaurant");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this restaurant?")) {
      try {
        await deleteRestaurant(id);
        showToast("Restaurant deleted successfully", "success");
        fetchRestaurants();
      } catch (err) {
        console.error(err);
        showToast("Failed to delete restaurant");
      }
    }
  };

  const filteredRestaurants = restaurants.filter((res) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      res.name?.toLowerCase().includes(term) ||
      res.address?.toLowerCase().includes(term) ||
      res.contactEmail?.toLowerCase().includes(term) ||
      res.contactPhone?.toLowerCase().includes(term) ||
      res.description?.toLowerCase().includes(term) ||
      String(res.id).includes(term)
    );
  });

  return (
    <div className="admin-restaurants">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="section-title">
          <FaStore /> Restaurants
        </h3>
        <button className="btn btn-success add-restaurant-btn" onClick={openAddModal}>
          <FaPlus /> Add  Restaurant
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-4">Loading...</div>
      ) : (
        <div className="row g-3">
          {filteredRestaurants.map((res) => (
            <div key={res.id} className="col-md-5col">
              <div className="restaurant-card">
                {res.imageUrl ? (
                  <img
                    src={res.imageUrl}
                    alt={res.name}
                    className="restaurant-image"
                  />
                ) : (
                  <div className="restaurant-image-placeholder">
                    <FaImage size={40} />
                  </div>
                )}

                <h5 className="restaurant-name">{res.name}</h5>
                <small className="restaurant-id">ID: {res.id}</small>

                <p>
                  <FaMapMarkerAlt /> {res.address}
                </p>
                <p>
                  <FaEnvelope /> {res.contactEmail}
                </p>
                <p>
                  <FaPhone /> {res.contactPhone}
                </p>
                <p className="desc">{res.description}</p>

                <div className="actions">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => openEditModal(res)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(res.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal fade show d-block" role="dialog">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>
                  {editingRestaurant ? "Edit Restaurant" : "Add Restaurant"}
                </h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Name *"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Address *"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email *"
                      value={formData.contactEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, contactEmail: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Phone *"
                      value={formData.contactPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, contactPhone: e.target.value })
                      }
                      pattern="[7-9][0-9]{9}"
                      title="Must start with 7, 8, or 9 and be 10 digits"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-12">
                    <input
                      className="form-control"
                      placeholder="Image URL"
                      value={formData.imageUrl}
                      onChange={handleImageUrlChange}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview mt-2"
                      />
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    {editingRestaurant ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          bg={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default AdminRestaurants;
