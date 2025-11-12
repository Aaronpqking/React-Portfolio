import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import LeadCaptureModal from './LeadCaptureModal';

function Header() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <LeadCaptureModal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        triggerSource="header-cta"
      />
      <Navbar expand="lg" className="consultancy-navbar" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
            Aaron King
            <span className="text-primary"> Consulting</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/case-studies">Case Studies</Nav.Link>
              <Nav.Link as={Link} to="/Resume">About</Nav.Link>
            </Nav>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => setShowModal(true)}
                className="d-none d-md-inline-block"
              >
                Get Started
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowModal(true)}
              >
                Contact
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ height: '76px' }} /> {/* Spacer for fixed navbar */}
    </>
  );
}

export default Header;