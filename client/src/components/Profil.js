import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Spinner, Container, Row, Col, ListGroup, Form, Alert } from 'react-bootstrap';
import "../css/profil.css";

const Profil = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [userComments, setUserComments] = useState([]);
    const [userReplies, setUserReplies] = useState([]);
    const [likedMangas, setLikedMangas] = useState([]);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('/api/auth/checkAuth', { withCredentials: true })
            .then(res => {
                setUserInfo(res.data);
                setNewUsername(res.data.username); // Initialize with current username
            })
            .catch(err => console.error('Erreur lors de la récupération des informations de l\'utilisateur:', err));

        axios.get('/api/comments/comments', { withCredentials: true })
            .then(res => setUserComments(res.data))
            .catch(err => console.error('Erreur lors de la récupération des commentaires de l\'utilisateur:', err));

        axios.get('/api/comments/replies', { withCredentials: true })
            .then(res => setUserReplies(res.data))
            .catch(err => console.error('Erreur lors de la récupération des réponses de l\'utilisateur:', err));

        axios.get('/api/likes/manga/liked', { withCredentials: true })
            .then(res => {
                const likedMangaNames = res.data.map(manga => manga.mangaName);
                setLikedMangas(likedMangaNames);
            })
            .catch(err => console.error('Erreur lors de la récupération des mangas likés:', err));
    }, []);

    const handleDeleteComment = (commentId) => {
        axios.delete(`/api/comments/comments/${commentId}`, { withCredentials: true })
            .then(() => {
                setUserComments(userComments.filter(comment => comment.id !== commentId));
            })
            .catch(err => {
                console.error('Erreur lors de la suppression du commentaire:', err);
                alert('Erreur lors de la suppression du commentaire. Détails: ' + err.response.data.error);
            });
    };

    const handleDeleteReply = (replyId) => {
        axios.delete(`/api/comments/replies/${replyId}`, { withCredentials: true })
            .then(() => {
                setUserReplies(userReplies.filter(reply => reply.id !== replyId));
            })
            .catch(err => {
                console.error('Erreur lors de la suppression de la réponse:', err);
                alert('Erreur lors de la suppression de la réponse. Détails: ' + err.response.data.error);
            });
    };

    const handleUpdateUserInfo = () => {
        if (newPassword && newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        setLoading(true);
        axios.put('/api/auth/updateUserInfo', { username: newUsername, password: newPassword || undefined }, { withCredentials: true })
            .then(res => {
                setUserInfo(res.data);
                alert('Informations mises à jour avec succès');
                setError('');
            })
            .catch(err => {
                console.error('Erreur lors de la mise à jour des informations:', err);
                setError('Erreur lors de la mise à jour des informations. Détails: ' + err.response?.data?.error);
            })
            .finally(() => setLoading(false));
    };

    return (
        <Container className='main-content text-light'>
            {userInfo ? (
                <div>
                    <h1 className="text-center text-danger">Profil de {userInfo.username}</h1>
                    <p>Email: {userInfo.email}</p>
                    <Form>
                        <Form.Group className='mb-3'>
                            <Form.Label>Nom d'utilisateur</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newUsername} 
                                onChange={e => setNewUsername(e.target.value)} 
                                placeholder="Entrez votre nouveau nom d'utilisateur" 
                            />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Nouveau mot de passe</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={newPassword} 
                                onChange={e => setNewPassword(e.target.value)} 
                                placeholder="Entrez votre nouveau mot de passe" 
                            />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Confirmez le mot de passe</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={confirmPassword} 
                                onChange={e => setConfirmPassword(e.target.value)} 
                                placeholder="Confirmez votre nouveau mot de passe" 
                            />
                        </Form.Group>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Button variant="primary mb-3" onClick={handleUpdateUserInfo} disabled={loading}>
                            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Mettre à jour'}
                        </Button>
                    </Form>
                    <Row>
                        <Col>
                            <h3 className='mb-3'>Commentaires postés :</h3>
                            <ListGroup>
                                {userComments.map((comment, index) => (
                                    <ListGroup.Item key={index} className="bg-dark text-light d-flex justify-content-between align-items-center">
                                        {comment.comment}
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteComment(comment.id)}>Supprimer</Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                        <Col>
                            <h3 className='mb-3'>Réponses postées :</h3>
                            <ListGroup>
                                {userReplies.map((reply, index) => (
                                    <ListGroup.Item key={index} className="bg-dark text-light d-flex justify-content-between align-items-center">
                                        {reply.reply} (commentaire ID: {reply.comment_id})
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteReply(reply.id)}>Supprimer</Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                    </Row>
                    <h3 className='mb-3'>Mangas likés :</h3>
                    <ListGroup>
                        {likedMangas.map((manga, index) => (
                            <ListGroup.Item key={index} className="bg-dark text-light">
                                {manga}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <Spinner animation="border" variant="light" />
                    <span className="ml-2">Chargement...</span>
                </div>
            )}
        </Container>
    );
};

export default Profil;
