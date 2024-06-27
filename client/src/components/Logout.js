import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setLoggedInUser, setScans }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post('/api/auth/logout', {}, { withCredentials: true })
            .then(res => {
                setLoggedInUser(null); // Réinitialiser l'utilisateur connecté
                setScans([]); // Réinitialiser les scans
                navigate('/'); // Rediriger vers la page d'accueil
            })
            .catch(err => {
                console.error('Failed to logout:', err);
            });
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
