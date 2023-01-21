import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import "../Style/footer.css";

const Footer = () => {
  return (
    <>
      <Container fluid className="text-light page-footer d-flex pt-3 bg-warning">
        <Container>
          <Row className="pb-4 justify-content-between">
            <Col xs={12} md={4}>
              <ul className="no-bullets d-inline-block">
                <li>
                  <a className="footer-link" href="mailto:aaronpqking@gmail.com">
                    <span className="pr-3">
                      <FaEnvelope />
                    </span>
                    aaronpqking@gmail.com
                  </a>
                </li>
                </ul>
            </Col>
            <Col>
              <ul>
                <li>
                  <a className="footer-link" href="https://github.com/aaronpqking">
                    <span className="pr-3">
                      <FaGithub />
                    </span>
                    Aaronpqking
                  </a>
                </li>
                </ul>
            </Col>
            <Col>
                <ul>
                <li>
                  <a className="footer-link" href="https://www.linkedin.com/in/aaronpqking">
                    <span className="pr-3">
                      <FaLinkedin />
                    </span>
                    Aaronpqking
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  )
};
export default Footer;