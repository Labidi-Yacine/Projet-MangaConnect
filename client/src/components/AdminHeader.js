import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './AdminHeader.css'

const AdminHeader = () => {
  return (
    <Navbar bg="black" variant="dark" expand="lg" >
      <Navbar.Brand href="/admin" className='mr-auto titre'>Admin Dashboard</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="m-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/logout">Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AdminHeader;
