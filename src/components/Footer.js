import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import "../Style/footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="page-footer">
      <Container>
        <Row className="footer-main">
          <Col xs={12} md={6} lg={3} className="footer-column">
            <h6 className="footer-section-title">SERVICES</h6>
            <ul className="footer-links-list">
              <li>
                <Link to="/" className="footer-link">AI & Automation</Link>
              </li>
              <li>
                <Link to="/" className="footer-link">Custom Development</Link>
              </li>
              <li>
                <Link to="/" className="footer-link">System Integration</Link>
              </li>
              <li>
                <Link to="/" className="footer-link">Technical Consulting</Link>
              </li>
            </ul>
          </Col>
          
          <Col xs={12} md={6} lg={3} className="footer-column">
            <h6 className="footer-section-title">RESOURCES</h6>
            <ul className="footer-links-list">
              <li>
                <Link to="/case-studies" className="footer-link">Case Studies</Link>
              </li>
              <li>
                <Link to="/ai-demos" className="footer-link">AI Tools</Link>
              </li>
              <li>
                <Link to="/Resume" className="footer-link">About</Link>
              </li>
              <li>
                <Link to="/Contact" className="footer-link">Contact</Link>
              </li>
            </ul>
          </Col>
          
          <Col xs={12} md={6} lg={3} className="footer-column">
            <h6 className="footer-section-title">CONTACT US</h6>
            <ul className="footer-links-list">
              <li>
                <a 
                  className="footer-link" 
                  href="mailto:aaronpqking@gmail.com"
                >
                  <FaEnvelope className="footer-inline-icon" />
                  aaronpqking@gmail.com
                </a>
              </li>
              <li>
                <a 
                  className="footer-link" 
                  href="https://www.linkedin.com/in/aaronpqking"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="footer-inline-icon" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  className="footer-link" 
                  href="https://github.com/aaronpqking"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="footer-inline-icon" />
                  GitHub
                </a>
              </li>
            </ul>
          </Col>
          
          <Col xs={12} md={6} lg={3} className="footer-column">
            <h6 className="footer-section-title">CONNECT</h6>
            <div className="footer-social">
              <a 
                href="https://www.linkedin.com/in/aaronpqking"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a 
                href="https://github.com/aaronpqking"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a 
                href="mailto:aaronpqking@gmail.com"
                className="footer-social-icon"
                aria-label="Email"
              >
                <FaEnvelope />
              </a>
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col xs={12}>
            <div className="footer-bottom">
              <p className="footer-copyright">
                © {currentYear} QNA tech solutions. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;