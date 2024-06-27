import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const AdminEditManga = () => {
  const { mangaName } = useParams();
  const navigate = useNavigate();
  const [newMangaName, setNewMangaName] = useState('');
  const [error, setError] = useState(null);
  const [newSynopsis, setNewSynopsis] = useState(''); // Ajout du state pour le nouveau synopsis


  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const response = await axios.get(`/api/admin/mangas/${mangaName}`);
        setNewMangaName(response.data.name);
        setNewSynopsis(response.data.synopsis); // Récupérer et définir le synopsis

      } catch (error) {
        console.error('Erreur lors de la récupération des détails du manga:', error);
      }
    };
    fetchMangaDetails();
  }, [mangaName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/admin/mangas/update/${mangaName}`, {
        newMangaName,
        synopsis: newSynopsis // Inclure le nouveau synopsis dans la mise à jour

      });
      if (response.status === 200) {
        navigate('/admin/mangas'); // Rediriger vers AdminMangaManagement après une mise à jour réussie
      } else {
        throw new Error('Erreur lors de la mise à jour du manga');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Form className='text-light' onSubmit={handleSubmit}>
      <Row className="w-100 align-items-center">
        <Col md={8}>
          <Form.Group controlId="formMangaName">
            <Form.Label>Nom du Manga</Form.Label>
            <Form.Control
              type="text"
              value={newMangaName}
              onChange={(e) => setNewMangaName(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
                    <Form.Group controlId="formSynopsis"> {/* Ajout du champ pour le synopsis */}
                        <Form.Label>Synopsis</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={newSynopsis}
                            onChange={(e) => setNewSynopsis(e.target.value)}
                        />
                    </Form.Group>
                </Col>

        <Col md={12} className="mt-3">
          <Button variant="primary" type="submit">
            Mettre à jour
          </Button>
        </Col>
      </Row>
      {error && <p className="text-danger">{error}</p>}
    </Form>
  );
};

export default AdminEditManga;
