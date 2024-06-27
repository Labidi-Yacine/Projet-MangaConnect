import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';

const AdminHome = () => {
  return (
    <Container>
      <Row className="my-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>BIenvenu sur votre espace d'administration</Card.Title>
              <Card.Text>
                Utilisez la slide-bar pour naviguer a traver les differentes pages.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Gestion des Users</Card.Title>
              <Card.Text>
                Gerez les utilisateurs, accesdez a leur details et supprimez les.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Gestionn des mangas </Card.Title>
              <Card.Text>
                Ajoutez, supprimez ou modifier un manga ou un chapitre.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Gestion des commentaires</Card.Title>
              <Card.Text>
                accesdez et gerez les commentaires 
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminHome;
