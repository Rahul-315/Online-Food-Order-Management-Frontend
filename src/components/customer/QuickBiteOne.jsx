import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import "./QuickBiteOne.css";
import Footer from "./Footer";

const benefits = [
  { icon: "🍽", text: "Free delivery on all orders" },
  { icon: "💰", text: "Extra discounts at partner restaurants" },
  { icon: "⚡", text: "Priority customer support" },
  { icon: "🛒", text: "Free Instamart delivery" },
  { icon: "🎁", text: "Exclusive member-only offers" },
  { icon: "⭐", text: "Early access to new features" },
];

const floatingIcons = ["🍔","🍕","🍟","🥤","🍣","🍩"];

const QuickBiteOne = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <>
    <div className="quickbite-page">
    <div className="quickbite-one-hero">
      {/* Floating Icons */}
      {floatingIcons.map((icon, idx) => (
        <span key={idx} className={`floating-icon icon-${idx}`}>{icon}</span>
      ))}

      <Container className="py-5 text-center text-light">
        <h1 className="fw-bold mb-3" data-aos="fade-down">QuickBite One 🚀</h1>
        <p className="lead mb-5" data-aos="fade-up">
          One membership. Unlimited benefits. Enjoy the ultimate food experience!
        </p>

        <Row className="justify-content-center g-4">
          <Col md={8}>
            <Card className="membership-card shadow-lg p-4" data-aos="zoom-in">
              <h3 className="text-center mb-4">Membership Benefits</h3>
              <Row className="g-3">
                {benefits.map((benefit, idx) => (
                  <Col md={6} key={idx}>
                    <div className="benefit-item" data-aos="fade-up" data-aos-delay={idx*100}>
                      <span className="benefit-icon">{benefit.icon}</span>
                      <span className="benefit-text">{benefit.text}</span>
                    </div>
                  </Col>
                ))}
              </Row>

              <div className="membership-price mt-4 text-center">
                <h4>Price</h4>
                <p className="mb-2">
                  <strong>₹299 / 3 Months</strong>
                </p>
                <p className="text-muted">Cancel anytime</p>
                <Button className="btn-join mt-3" data-aos="fade-up" data-aos-delay="600">
                  Join Now
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    <Footer/>
    </div>
    </>
    
  );
};

export default QuickBiteOne;
