import React from 'react';
import { Nav } from 'react-bootstrap';

const AdminSidebar = () => {
  return (
    <Nav defaultActiveKey="/admin" className="flex-column bg-black vh-100 ">
      <Nav.Link href="/admin" className="text-white">Dashboard</Nav.Link>
      <Nav.Link href="/admin/users" className="text-white">Utilisateurs</Nav.Link>
      <Nav.Link href="/admin/mangas" className="text-white">Mangas</Nav.Link>
      <Nav.Link href="/admin/comments" className="text-white">Commentaires</Nav.Link>
    </Nav>
  );
};

export default AdminSidebar;
