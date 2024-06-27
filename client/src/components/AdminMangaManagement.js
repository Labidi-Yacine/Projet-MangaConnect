import React, { useState, useEffect } from 'react';
import { Table, Button, Form, FormControl, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminMangaManagement = () => {
    const [mangas, setMangas] = useState([]);
    const [mangaName, setMangaName] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [coverImage, setCoverImage] = useState(null);

    useEffect(() => {
        fetchMangas();
    }, []);

    const fetchMangas = async () => {
        try {
            const response = await axios.get('/api/admin/mangas');
            setMangas(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des mangas:', error);
        }
    };

    const addManga = async () => {
        try {
            const formData = new FormData();
            formData.append('mangaName', mangaName);
            formData.append('synopsis', synopsis);
            if (coverImage) {
                formData.append('coverImage', coverImage);
            }

            await axios.post('/api/admin/mangas', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchMangas();
            setMangaName('');
            setSynopsis('');
            setCoverImage(null);
        } catch (error) {
            console.error('Erreur lors de l\'ajout du manga:', error);
        }
    };

    const deleteManga = async (mangaName) => {
        try {
            await axios.delete(`/api/admin/mangas/delete/${mangaName}`);
            fetchMangas();
        } catch (error) {
            console.error('Erreur lors de la suppression du manga:', error);
        }
    };

    return (
        <div className='text-light'>
            <h2 className='text-center mb-3'>Gestion des Mangas</h2>
            <Form inline="true">
                <Row className="w-100">
                    <Col md={6} className="mb-3 mb-md-0">
                        <FormControl
                            type="text"
                            value={mangaName}
                            onChange={(e) => setMangaName(e.target.value)}
                            placeholder="Nom du manga"
                        />
                    </Col>
                    <Col md={6} className="mb-3 mb-md-0">
                        <FormControl
                            type="text"
                            value={synopsis}
                            onChange={(e) => setSynopsis(e.target.value)}
                            placeholder="Synopsis"
                        />
                    </Col>
                    <Col md={6} className="mb-3 mb-md-0 mt-2">
                        <FormControl
                            type="file"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                            placeholder="Image de couverture"
                        />
                    </Col>
                    <Col md={6} className='mt-2'>
                        <Button onClick={addManga} >Ajouter</Button>
                    </Col>
                </Row>
            </Form>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr className='text-center'>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {mangas.map((manga, index) => (
                        <tr key={manga.title}>
                            <td>{index + 1}</td>
                            <td>{manga.title}</td>
                            <td className='d-flex justify-content-evenly'>
                                <Button variant="danger" onClick={() => deleteManga(manga.title)}>Supprimer</Button>
                                <Link to={`/admin/mangas/${manga.title}/edit`} className="ml-3">
                                    <Button >Modifier Manga</Button>
                                </Link>
                                <Link to={`/admin/mangas/${manga.title}/scans/edit`} className="ml-3">
                                    <Button >Modifier Scans</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default AdminMangaManagement;
