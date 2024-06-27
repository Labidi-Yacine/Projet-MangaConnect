import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Importer le composant Link depuis react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css';

function Menu() {
  return (
    <Navbar className="bg-black d-flex justify-content-center" expand="lg">
      <Navbar.Brand className="text-white" href="#">MangaConnect</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="d-flex justify-content-center mr-auto">
          {/* Utiliser Link pour créer des liens de navigation */}
          <Link className="nav-link text-white" to="/">Accueil</Link>
          <Link className="nav-link text-white" to="/about">À propos</Link>
          <Link className="nav-link text-white" to="/contact">Contact</Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Menu;
