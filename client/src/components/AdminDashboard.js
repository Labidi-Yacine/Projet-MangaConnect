import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminUsers from './AdminUsers';
import AdminMangaManagement from './AdminMangaManagement';
import Admincomments from './AdminComments'
import AdminEditScans from './AdminEditScans';
import AdminHome from './AdminHome'
import AdminEditManga from './AdminEditManga'
import { Route, Routes } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <Container fluid>
      <Row>
        <AdminHeader />
      </Row>
      <Row>
        <Col md={2} className="bg-black">
          <AdminSidebar />
        </Col>
        <Col md={10} className="p-4">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="mangas" element={<AdminMangaManagement />} />
            <Route path="mangas/:mangaName/edit" element={<AdminEditManga />} />
            <Route path="mangas/:mangaName/scans/edit" element={<AdminEditScans />} />
            <Route path="comments" element={<Admincomments />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
