import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link} from "react-router-dom"


function Header() {
  return (
    

    <Navbar bg="warning" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Aaron King</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="navbar-nav d-flex" style={{ display: 'flex', justifyContent: 'space-around'}}>
            <Link to="/" style={{margin:10}}> Home </Link>
            <Link to="/Project" style={{margin:10}}>Portfolio</Link>
            <NavDropdown title="Info" id="basic-nav-dropdown" style={{margin:2}}>
              <NavDropdown.Item href="/Resume">Resume</NavDropdown.Item>
              <NavDropdown.Item href="https://github.com/aaronpqking?tab=repositories" target="blank">
                My Repository
              </NavDropdown.Item>
              <NavDropdown.Item href="/Contact">Contact Me</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default Header;