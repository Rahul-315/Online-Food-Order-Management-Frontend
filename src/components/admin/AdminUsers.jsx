import React, { useEffect, useState, useCallback } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} from "../../api/admin";
import {
  Modal,
  Button,
  Form,
  Toast,
  ToastContainer,
  InputGroup,
  FormControl,
  ProgressBar
} from "react-bootstrap";
import { FaEdit, FaTrash, FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import "./AdminUsers.css";

const ALLOWED_ROLES = ["ADMIN", "RESTAURANT_STAFF"];

const AdminUsers = ({ searchTerm }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "RESTAURANT_STAFF",
    password: "",
    restaurantId: "",
    mobileNumber: "",
    address: "" // ✅ added
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  const usernameRegex = /^.{3,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const mobileRegex = /^[7-9][0-9]{9}$/;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch users", "danger");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user => {
    if (!ALLOWED_ROLES.includes(user.role)) return false;

    if (!searchTerm) return true;
    return (
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.mobileNumber && user.mobileNumber.includes(searchTerm))
    );
  });

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        password: "",
        restaurantId: user.restaurant?.id || "",
        mobileNumber: user.mobileNumber || "",
        address: user.address || "" // ✅ added
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        email: "",
        role: "RESTAURANT_STAFF",
        password: "",
        restaurantId: "",
        mobileNumber: "",
        address: "" // ✅ added
      });
    }
    setPasswordStrength(0);
    setShowPassword(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      username: "",
      email: "",
      role: "RESTAURANT_STAFF",
      password: "",
      restaurantId: "",
      mobileNumber: "",
      address: "" // ✅ added
    });
    setPasswordStrength(0);
    setShowPassword(false);
  };

  const evaluatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[@$!%*?&]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const getStrengthVariant = () =>
    passwordStrength <= 1 ? "danger" : passwordStrength <= 3 ? "warning" : "success";

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ALLOWED_ROLES.includes(formData.role)) {
      showToast("Only Admin or Staff can be created", "danger");
      return;
    }

    if (!usernameRegex.test(formData.username.trim())) {
      showToast("Username must be 3-20 characters", "danger");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      showToast("Enter a valid email", "danger");
      return;
    }
    if (!mobileRegex.test(formData.mobileNumber)) {
      showToast("Mobile number must start with 7,8,9 and be 10 digits", "danger");
      return;
    }
    if (!editingUser && !passwordRegex.test(formData.password)) {
      showToast(
        "Password must be at least 8 chars, include 1 uppercase, 1 number, and 1 special character",
        "danger"
      );
      return;
    }

    const payload = { ...formData };
    if (editingUser && !payload.password) delete payload.password;

    try {
      if (editingUser) {
        await updateUser(editingUser.id, payload);
        showToast("User updated successfully");
      } else {
        await createUser(payload);
        showToast("User created successfully");
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast("Operation failed", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        await deleteUser(id);
        showToast("User deleted successfully");
        fetchUsers();
      } catch (err) {
        console.error(err);
        showToast("Delete failed", "danger");
      }
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="admin-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Admin & Staff Management</h3>
        <Button variant="primary" onClick={() => openModal()}>
          <FaUserPlus className="me-2" /> Add Staff
        </Button>
      </div>

      <div className="row g-3">
        {filteredUsers.map((user) => (
          <div key={user.id} className="col-md-3">
            <div className="card shadow-sm p-3 h-100">
              <h5>{user.username}</h5>
              <p>{user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Mobile:</strong> {user.mobileNumber || "-"}</p>
              <p><strong>Address:</strong> {user.address || "-"}</p>
              <div className="d-flex gap-2 mt-auto">
                <Button size="sm" variant="outline-primary" onClick={() => openModal(user)}>
                  <FaEdit />
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(user.id)}>
                  <FaTrash />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Control className="mb-2" placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />

            <Form.Control className="mb-2" type="email" placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Form.Control className="mb-2" placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              required
            />

            <Form.Control
              as="textarea"
              rows={2}
              className="mb-2"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />

            <InputGroup className="mb-2">
              <FormControl
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  evaluatePasswordStrength(e.target.value);
                }}
                required={!editingUser}
              />
              <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroup.Text>
            </InputGroup>

            {formData.password && (
              <ProgressBar now={(passwordStrength / 4) * 100} variant={getStrengthVariant()} />
            )}

            <Form.Select className="mb-2" value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="ADMIN">Admin</option>
              <option value="RESTAURANT_STAFF">Staff</option>
            </Form.Select>

            {formData.role === "RESTAURANT_STAFF" && (
              <Form.Control className="mb-2" placeholder="Restaurant ID"
                value={formData.restaurantId}
                onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                required
              />
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="success" type="submit">
              {editingUser ? "Update" : "Create"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={toast.show} bg={toast.type} autohide>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default AdminUsers;
