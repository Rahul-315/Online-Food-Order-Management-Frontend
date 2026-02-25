import React, { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../../api/customer";
import { toast } from "react-toastify";
import "./CustomerProfileModal.css";

const CustomerProfileModal = ({ show, onClose }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    address: "", // ✅ added
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (show) {
      getMyProfile()
        .then((res) => {
          setForm({
            username: res.data.username || "",
            email: res.data.email || "",
            mobileNumber: res.data.mobileNumber || "",
            address: res.data.address || "", // ✅ added
            password: "",
            confirmPassword: "",
          });
        })
        .catch(() => toast.error("Failed to fetch profile"));
    }
  }, [show]);

  if (!show) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!form.username || form.username.length < 3 || form.username.length > 20) {
      toast.error("Username must be 3-20 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      toast.error("Enter a valid email");
      return false;
    }

    const mobileRegex = /^[7-9][0-9]{9}$/;
    if (!form.mobileNumber || !mobileRegex.test(form.mobileNumber)) {
      toast.error(
        "Mobile number must start with 7, 8, or 9 and be 10 digits"
      );
      return false;
    }

    // ✅ Address validation
    if (!form.address || form.address.trim().length < 10) {
      toast.error("Address must be at least 10 characters");
      return false;
    }

    if (form.password) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (!passwordRegex.test(form.password)) {
        toast.error(
          "Password must be at least 8 chars, include 1 uppercase, 1 number, and 1 special character"
        );
        return false;
      }

      if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateMyProfile(form); // address automatically included
      toast.success("Profile updated successfully");
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to update profile. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="sidebar-modal profile-dropdown-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h5 className="modal-title">Edit Profile</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="modal-body">
          <input
            className="form-control mb-2"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
          />

          <input
            className="form-control mb-2"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <input
            className="form-control mb-2"
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            placeholder="Mobile Number"
          />

          {/* ✅ Address */}
          <textarea
            className="form-control mb-2"
            name="address"
            rows="2"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
          />

          <input
            type="password"
            className="form-control mb-2"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password (optional)"
          />

          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileModal;
