import React, { useState } from "react";
import { registerPartnerRestaurant } from "../../api/customer";
import "./PartnerRegister.css";

const PartnerRegister = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    description: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await registerPartnerRestaurant(form);
      setSuccess(true);

      setForm({
        name: "",
        address: "",
        contactEmail: "",
        contactPhone: "",
        description: "",
        imageUrl: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="partner-register-container">
      <div className="partner-register-card">
        <h2>Register Your Restaurant</h2>
        <p className="subtitle">
          Partner with QuickBite and reach thousands of hungry customers 🍽️
        </p>

        {success && (
          <div className="success-msg">
            ✅ Request submitted! Admin will review your application.
          </div>
        )}

        <form onSubmit={submit} className="partner-form">
          <input
            name="name"
            placeholder="Restaurant Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Restaurant Address"
            value={form.address}
            onChange={handleChange}
          />

          <input
            type="email"
            name="contactEmail"
            placeholder="Contact Email"
            value={form.contactEmail}
            onChange={handleChange}
          />

          <input
            name="contactPhone"
            placeholder="Contact Phone"
            value={form.contactPhone}
            onChange={handleChange}
          />

          <input
            name="imageUrl"
            placeholder="Restaurant Image URL (optional)"
            value={form.imageUrl}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Short Description"
            rows="3"
            value={form.description}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartnerRegister;
