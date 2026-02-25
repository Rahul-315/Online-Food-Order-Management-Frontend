import React, { useState, useMemo, useRef } from "react";
import { addToCart } from "../../api/customer";
import { Toast, ToastContainer, Form } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import { FaChevronLeft, FaChevronRight, FaLeaf, FaHeart, FaStar } from "react-icons/fa";
import { GiChickenLeg } from "react-icons/gi";
import { isAuthenticated } from "../../auth/auth";
import { useNavigate } from "react-router-dom";
import "./CustomerMenu.css";

const SORT_OPTIONS = {
  RECOMMENDED: "recommended",
  LOW_TO_HIGH: "lowToHigh",
  HIGH_TO_LOW: "highToLow",
};

const CustomerMenu = ({ restaurant, menuItems, searchQuery, cart, refreshCart }) => {
  const { incrementCart } = useCart();
  const navigate = useNavigate();
  const rowRefs = useRef({});

  const [loadingItem, setLoadingItem] = useState(null);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.RECOMMENDED);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [likedItems, setLikedItems] = useState(new Set());
  const [foodType, setFoodType] = useState(null); // null | VEG | NON_VEG
  const [toast, setToast] = useState({ show: false, message: "", type: "danger" });

  /* ================= FILTER + SORT ================= */
  const processedItems = useMemo(() => {
    let items = [...menuItems];

    if (searchQuery) {
      items = items.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (foodType) {
      items = items.filter((i) => i.foodType === foodType);
    }

    if (onlyAvailable) {
      items = items.filter((i) => i.available);
    }

    if (activeCategory !== "All") {
      items = items.filter((i) => (i.category || "Others") === activeCategory);
    }

    if (sortBy === SORT_OPTIONS.LOW_TO_HIGH) {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === SORT_OPTIONS.HIGH_TO_LOW) {
      items.sort((a, b) => b.price - a.price);
    }

    return items;
  }, [menuItems, searchQuery, sortBy, onlyAvailable, activeCategory, foodType]);

  /* ================= CATEGORY ================= */
  const categories = useMemo(() => {
    const cats = new Set(menuItems.map((i) => i.category || "Others"));
    return ["All", ...cats];
  }, [menuItems]);

  const categorizedItems = useMemo(() => {
    const map = {};
    processedItems.forEach((item) => {
      const cat = item.category || "Others";
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    });
    return map;
  }, [processedItems]);

  /* ================= HANDLERS ================= */
  const scroll = (category, dir) => {
    const el = rowRefs.current[category];
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  const handleGuestClick = () => {
    setToast({ show: true, message: "Please login to place your order 🔐", type: "danger" });
    setTimeout(() => navigate("/login"), 1200);
  };

  const handleAddToCart = async (itemId, e, menuItemRestaurantId) => {
    e.stopPropagation();
    if (cart && cart.cartItems.length > 0) {
      const currentRestaurantId = cart.cartItems[0].menuItem.restaurant.id;
      if (currentRestaurantId !== menuItemRestaurantId) {
        setToast({
          show: true,
          message: "You can only add items from one restaurant at a time 🍽️",
          type: "danger",
        });
        return;
      }
    }

    incrementCart();
    setLoadingItem(itemId);

    try {
      await addToCart(itemId, 1);
      setToast({ show: true, message: "Added to cart 🛒", type: "success" });
      if (refreshCart) refreshCart();
    } catch {
      setToast({ show: true, message: "Failed to add item", type: "danger" });
    } finally {
      setLoadingItem(null);
    }
  };

  const handleLike = (itemId) => {
    setLikedItems((prev) => {
      const updated = new Set(prev);
      if (updated.has(itemId)) updated.delete(itemId);
      else updated.add(itemId);
      return updated;
    });
  };

  /* ================= UI ================= */
  return (
    <div className="customer-menu container-fluid mt-4">
      <h4 className="menu-heading">{restaurant.name} Menu</h4>

      {/* FILTER BAR */}
      <div className="menu-filters d-flex flex-wrap gap-3 align-items-center mb-3">
        <div className="diet-filter">
          <div className="diet-chips">
            <div
              className={`diet-chip veg ${foodType === "VEG" ? "active" : ""}`}
              onClick={() => setFoodType(foodType === "VEG" ? null : "VEG")}
            >
              <FaLeaf /> Veg
            </div>
            <div
              className={`diet-chip nonveg ${foodType === "NON_VEG" ? "active" : ""}`}
              onClick={() => setFoodType(foodType === "NON_VEG" ? null : "NON_VEG")}
            >
              <GiChickenLeg /> Non-Veg
            </div>
          </div>
        </div>

        <div className="advanced-filters">
          <Form.Select
            size="sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value={SORT_OPTIONS.RECOMMENDED}>Recommended</option>
            <option value={SORT_OPTIONS.LOW_TO_HIGH}>Price ↑ Low to High</option>
            <option value={SORT_OPTIONS.HIGH_TO_LOW}>Price ↓ High to Low</option>
          </Form.Select>

          <div
            className={`availability-chip ${onlyAvailable ? "active" : ""}`}
            onClick={() => setOnlyAvailable(!onlyAvailable)}
          >
            ✅ Available only
          </div>
        </div>

        <div className="category-pills d-flex gap-2 overflow-auto">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`category-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* MENU LIST */}
      {Object.keys(categorizedItems).map((category) => (
        <div key={category} className="mb-4 position-relative">
          <h5 className="category-title">{category}</h5>

          <div className="scroll-buttons-right">
            <button onClick={() => scroll(category, "left")}>
              <FaChevronLeft />
            </button>
            <button onClick={() => scroll(category, "right")}>
              <FaChevronRight />
            </button>
          </div>

          <div className="menu-row full-width-row" ref={(el) => (rowRefs.current[category] = el)}>
            {categorizedItems[category].map((item) => (
              <div key={item.id} className="menu-col">
                <div
                  className="card menu-card foodie-style position-relative"
                  onClick={!isAuthenticated() ? handleGuestClick : undefined}
                >
                  {/* Rating Badge */}
                  {item.rating && (
                    <div className="rating-badge d-flex align-items-center">
                      <FaStar className="me-1" /> {item.rating.toFixed(1)}
                    </div>
                  )}

                  {/* Like/Favorite Icon */}
                  <div
                    className={`like-icon ${likedItems.has(item.id) ? "liked" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(item.id);
                    }}
                  >
                    <FaHeart />
                  </div>

                  <img
                    src={item.imageUrl || "https://source.unsplash.com/300x200/?food"}
                    alt={item.name}
                    className="menu-card-img"
                  />

                  <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      {item.foodType === "VEG" ? (
                        <FaLeaf className="veg-icon" />
                      ) : (
                        <GiChickenLeg className="nonveg-icon" />
                      )}
                      <h6 className="menu-title mb-0">{item.name}</h6>
                    </div>

                    <span className="price">₹{item.price}</span>

                    {/* ================= UPDATED ADD TO CART BUTTON ================= */}
                    {isAuthenticated() ? (
                      <button
                        className="btn btn-primary mt-auto"
                        disabled={!item.available || loadingItem === item.id}
                        onClick={(e) => handleAddToCart(item.id, e, item.restaurant?.id)}
                      >
                        {loadingItem === item.id
                          ? "Adding..."
                          : item.available
                          ? "Add to Cart"
                          : "Unavailable"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary mt-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGuestClick();
                        }}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Toast */}
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

export default CustomerMenu;
