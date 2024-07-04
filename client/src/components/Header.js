import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './header.css';

const Header = ({ loggedInUser, setLoggedInUser }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleSelect = () => {
    setExpanded(false);
  };

  return (

<Navbar expand="lg" variant="dark" bg="black" className='nav.bar'>
    <div className="container-fluid">
      <Navbar.Brand href="/">
        <img src="/logoFinal.png" alt="Logo" className="logo d-inline-block align-text-top" />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="navbarNav "  className='navbartoggle' />
      
      <Navbar.Collapse id="navbarNav" className="text-light justify-content-center">
        <Nav className="me-auto link">
          {/* <Nav.Link as={Link} to="/" onClick={handleSelect} className="text-white">Home</Nav.Link> */}
          <Nav.Link as={Link} to="/catalogue" onClick={handleSelect} className="text-white cata-link"> <img src="/catalogue.png" alt="Catalogue Logo" className="catalogue-logo " /> Catalogue  </Nav.Link>
          {loggedInUser && (
            <Nav.Link as={Link} to="/profil" onClick={handleSelect} className="text-white profil-link"> <img src="/profil.png" alt="Profil Logo" className="profil-logo" /> Profil</Nav.Link>
            
          )}
          {/* <Navbar.Text className="mr-4 connected text-white">{loggedInUser}</Navbar.Text> */}
        </Nav>
        
        <div className="d-flex auth-links">
          {loggedInUser ? (
            <>
                {/* <Navbar.Text className="mr-4 connected text-white">{loggedInUser}</Navbar.Text> */}
                
              <Button
                onClick={() => {
                  fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include',
                  }).then(() => {
                    setLoggedInUser('');
                  });
                }}
                variant="primary"
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login" onClick={handleSelect} className="text-white auth-link ">Connexion</Nav.Link>
              <Nav.Link as={Link} to="/register" onClick={handleSelect} className="text-white auth-link ">Inscription</Nav.Link>
            </>
          )}
        </div>
      </Navbar.Collapse>
    </div>
  </Navbar>

  );
}

export default Header;