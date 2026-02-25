import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Delivery.css";
import Footer from "./Footer";

const benefits = [
  {
    icon: "🕒",
    title: "Flexible Hours",
    desc: "Choose your own schedule and work at your convenience."
  },
  {
    icon: "💰",
    title: "Weekly Payouts",
    desc: "Get paid weekly without any delays."
  },
  {
    icon: "📍",
    title: "Local Deliveries",
    desc: "Work within your city and reduce travel time."
  },
  {
    icon: "📱",
    title: "Easy-to-use App",
    desc: "Track deliveries, earnings, and ratings in real-time."
  },
  {
    icon: "🎁",
    title: "Bonuses & Incentives",
    desc: "Earn extra through referrals and peak-time bonuses."
  },
  {
    icon: "⭐",
    title: "Ratings & Feedback",
    desc: "Build your reputation and get recognized for great service."
  },
];

const Delivery = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
    <div className="delivery-page py-5">
      <Container>
        <div className="text-center mb-5">
          <h1 className="fw-bold">Ride with QuickBite</h1>
          <p className="lead">
            Earn on your own schedule with QuickBite Delivery Partner.
          </p>
          <Button className="signup-btn mt-3" href="/delivery">
            Sign Up Now
          </Button>
        </div>

        <Row className="g-4">
          {benefits.map((benefit, idx) => (
            <Col md={6} lg={4} key={idx} data-aos="fade-up">
              <Card className="benefit-card h-100 text-center shadow-sm">
                <div className="card-icon">{benefit.icon}</div>
                <Card.Body>
                  <Card.Title>{benefit.title}</Card.Title>
                  <Card.Text>{benefit.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-5">
          <p>
            Join thousands of delivery partners across the city and grow your earnings with QuickBite.
          </p>
          <Button className="signup-btn" href="/delivery">
            Become a Delivery Partner
          </Button>
        </div>
      </Container>
    </div>
    <Footer />
    </>
  );
};

export default Delivery;
