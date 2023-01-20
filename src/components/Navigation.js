import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Link} from "react-router-dom"



function Navigation() {
  return (
    

    <Navbar bg="warning" expand="lg">
      <Container>
        <Navbar.Brand href="#home"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="navbar-nav d-flex" style={{ display: 'flex', justifyContent: 'space-around'}}>
            <Link to="/"> <Nav.Link>Home</Nav.Link></Link>
            <Link to="/Project"><Nav.Link>Portfolio</Nav.Link></Link>
            <NavDropdown title="Links" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Resume</NavDropdown.Item>
              <NavDropdown.Item href="https://github.com/aaronpqking?tab=repositories">
                My Repository
              </NavDropdown.Item>
              <NavDropdown.Item href="#aboutMe">Get Resume</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Contact Me
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;

