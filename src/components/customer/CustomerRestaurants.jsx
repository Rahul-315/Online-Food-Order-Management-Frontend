import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  getAllRestaurants,
  getMenuByRestaurant,
  getCart,
} from "../../api/customer";
import CustomerMenu from "./CustomerMenu";
import { Toast, ToastContainer, Spinner, Button } from "react-bootstrap";
import "./CustomerRestaurants.css";

const CustomerRestaurants = ({ searchQuery }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState(null); // ✅ current cart
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "danger" });

  const showToast = (message, type = "danger") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  // Fetch restaurants from API
  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getAllRestaurants();
      const restaurantsData = Array.isArray(res.data)
        ? res.data
        : res.data.restaurants || [];

      setRestaurants(restaurantsData);

      if (restaurantsData.length > 0) {
        setSelectedRestaurant(restaurantsData[0]);
        fetchMenu(restaurantsData[0].id);
      }
    } catch (err) {
      console.error(err);
      setError(true);
      showToast("Failed to load restaurants", "danger");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch menu for a restaurant
  const fetchMenu = async (restaurantId) => {
    try {
      const res = await getMenuByRestaurant(restaurantId);
      setMenuItems(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load menu");
    }
  };

  // Fetch current cart
  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    fetchCart();
  }, [fetchRestaurants]);

  // Filter restaurants based on search
  const filteredRestaurants = useMemo(() => {
    if (!searchQuery) return restaurants;
    return restaurants.filter((r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [restaurants, searchQuery]);

  if (loading) {
    return (
      <div className="restaurants-grid full-width-grid">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="restaurant-card skeleton"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <h5>Failed to load restaurants 😞</h5>
        <Button variant="primary" onClick={fetchRestaurants}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container-fluid customer-dashboard">
      <h3 className="section-title">Restaurants</h3>

      <div className="restaurants-grid full-width-grid">
        {filteredRestaurants.length === 0 ? (
          <p className="text-center mt-3">No restaurants found 🍽️</p>
        ) : (
          filteredRestaurants.map((r, i) => (
            <div
              key={r.id}
              className={`restaurant-card fade-slide-up ${
                selectedRestaurant?.id === r.id ? "selected" : ""
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => {
                setSelectedRestaurant(r);
                fetchMenu(r.id);
              }}
            >
              <div className="restaurant-image-wrapper">
                <img
                  src={
                    r.imageUrl ||
                    "https://source.unsplash.com/400x300/?restaurant,food"
                  }
                  alt={r.name}
                  className="restaurant-image"
                />

                {r.rating ? (
                  <div className="rating-badge">⭐ {r.rating.toFixed(1)}</div>
                ) : (
                  <div className="new-badge">New</div>
                )}
              </div>

              <div className="restaurant-info">
                <h5>{r.name}</h5>
                <p>{r.address}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Menu Section */}
      {selectedRestaurant && menuItems.length > 0 && (
        <CustomerMenu
          restaurant={selectedRestaurant}
          menuItems={menuItems}
          searchQuery={searchQuery}
          cart={cart} // ✅ pass current cart
          refreshCart={fetchCart} // optional: refresh cart after add
        />
      )}

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          bg={toast.type}
          autohide
          delay={3000}
          onClose={() => setToast({ ...toast, show: false })}
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default CustomerRestaurants;
