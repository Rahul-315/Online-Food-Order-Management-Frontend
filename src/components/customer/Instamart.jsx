import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Instamart.css";
import Footer from "./Footer";

const Instamart = () => {
  const items = [
    { icon: "🥦", title: "Fresh Produce", desc: "Farm-fresh fruits & vegetables sourced daily" },
    { icon: "🥛", title: "Dairy & Bakery", desc: "Milk, bread, eggs, cakes & more" },
    { icon: "🧴", title: "Personal Care", desc: "Daily essentials & household supplies" },
    { icon: "🍫", title: "Snacks & Drinks", desc: "Chocolates, chips, juices & beverages" },
    { icon: "🍗", title: "Meat & Seafood", desc: "Fresh meat, poultry & fish delivered safely" },
    { icon: "🥫", title: "Canned & Packaged", desc: "Ready-to-eat & packaged food items" },
    { icon: "🍵", title: "Beverages & Coffee", desc: "Tea, coffee, soft drinks & energy drinks" },
    { icon: "🌿", title: "Organic & Health", desc: "Organic products, supplements & superfoods" },
  ];

  return (
    <>
    <Container className="instamart-container py-5">
      {/* Header */}
      <div className="text-center mb-5 fade-in">
        <h1 className="fw-bold instamart-title">QuickBite Instamart</h1>
        <p className="lead text-muted">
          Groceries & daily essentials delivered to your doorstep in minutes.
        </p>
      </div>

      {/* Cards Section */}
      <h4 className="mb-4 fw-semibold text-center">What you can order</h4>
      <Row className="g-4">
        {items.map((item, index) => (
          <Col xs={12} sm={6} md={4} lg={3} key={index}>
            <Card className="instamart-card h-100 text-center">
              <div className="icon-circle">{item.icon}</div>
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text className="text-muted">{item.desc}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Footer */}
      <div className="text-center mt-5 slide-up">
        <p className="text-muted">
          Available in select cities. Expanding rapidly 🚀
        </p>
        
      </div>
    
    </Container>
    <Footer />
    </>
  );
};

export default Instamart;
