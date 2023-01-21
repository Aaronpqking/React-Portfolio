import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link} from "react-router-dom"
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Header() {


  return (
    
<div bg="warning">
<Navbar bg="warning" expand="lg" className='justify-content-center'>
  <Container>
    <Navbar.Brand href="#home"></Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="navbar-nav d-flex justify-content-center">
        <Link to="/" className='mx-3'> Home </Link>
        <Link to="/Project" className='mx-3'>Portfolio</Link>
        <Link to="/Resume" className='mx-3'>Resume</Link>
        <Link href="https://github.com/aaronpqking?tab=repositories" target="blank" className='mx-3'>My Repository</Link>
        <Link href="/Contact" className='mx-3'>Contact Me</Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
</div>
  )
};

export default Header;