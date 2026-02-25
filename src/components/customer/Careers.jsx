import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS CSS
import "./Careers.css";
import Footer from "./Footer";

const roles = [
  {
    id: "frontend",
    title: "Frontend Engineer",
    type: "Full-time",
    location: "Remote / Bangalore",
    category: "Tech",
    description: "Build delightful user experiences using React & modern UI patterns.",
  },
  {
    id: "backend",
    title: "Backend Engineer",
    type: "Full-time",
    location: "Bangalore",
    category: "Backend",
    description: "Design scalable APIs using Java, Spring Boot & cloud services.",
  },
  {
    id: "ops",
    title: "Delivery Operations",
    type: "Full-time",
    location: "City-based",
    category: "Operations",
    description: "Optimize logistics and ensure fast, reliable deliveries.",
  },
  {
    id: "support",
    title: "Customer Support",
    type: "Shift-based",
    location: "Remote",
    category: "Support",
    description: "Help customers and partners with empathy & speed.",
  },
];

const Careers = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleOpenModal = (role) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
  };

  const handleApply = (e) => {
    e.preventDefault();
    alert(`Application submitted for ${selectedRole.title}!`);
    handleCloseModal();
  };

  return (
    <div className="careers-page">
      {/* HERO */}
      <div className="careers-hero text-center" data-aos="fade-down">
        <h1 className="fw-bold">Careers at QuickBite 🚀</h1>
        <p className="mt-3">Build products that deliver happiness to millions.</p>
        
  {/* Floating Particles */}
  <div className="particle" style={{ top: "20%", left: "30%" }}></div>
  <div className="particle" style={{ top: "40%", left: "70%" }}></div>
  <div className="particle" style={{ top: "60%", left: "50%" }}></div>
  <div className="particle" style={{ top: "80%", left: "20%" }}></div>
  <div className="particle" style={{ top: "10%", left: "80%" }}></div>
      </div>

      <Container className="py-5">
        {/* WHY QUICKBITE */}
        <Row className="mb-5" data-aos="fade-up">
          <Col md={6}>
            <h3 className="fw-semibold mb-3">Why QuickBite?</h3>
            <ul className="why-list">
              <li>🚀 High-growth food-tech startup</li>
              <li>💡 Ownership & rapid learning</li>
              <li>🌍 Impact millions of users daily</li>
              <li>🤝 Inclusive & collaborative culture</li>
            </ul>
          </Col>
          <Col md={6}>
            <div className="why-card">
              <h5>Life at QuickBite</h5>
              <p>
                We move fast, experiment boldly, and put customers first. Your ideas matter here.
              </p>
            </div>
          </Col>
        </Row>

        {/* OPEN ROLES */}
        <h3 className="fw-semibold mb-4 text-center" data-aos="fade-up">
          Open Roles
        </h3>
        <Row className="g-4">
          {roles.map((role, idx) => (
            <Col
              md={6}
              lg={3}
              key={role.id}
              data-aos="fade-up"
              data-aos-delay={idx * 100} // Stagger animation
            >
              <Card
                className="role-card-advanced h-100"
                onClick={() => handleOpenModal(role)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <span className={`role-badge ${role.category.toLowerCase()}`}>
                    {role.category}
                  </span>
                  <h5>{role.title}</h5>
                  <p className="role-desc">{role.description}</p>
                  <div className="role-meta">
                    <span>📍 {role.location}</span>
                    <span>⏱ {role.type}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* APPLY MODAL */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Apply for {selectedRole ? selectedRole.title : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleApply}>
            <Form.Group className="mb-3" controlId="applicantName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="applicantEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="applicantResume">
              <Form.Label>Resume</Form.Label>
              <Form.Control type="file" required />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100">
              Submit Application
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      { <Footer />}
    </div>
  );
};

export default Careers;
