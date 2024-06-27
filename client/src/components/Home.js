import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Home.css";

const Home = () => {
  const [recentScans, setRecentScans] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentScans = async () => {
      try {
        const response = await axios.get('/api/scans/read', { withCredentials: true });
        setRecentScans(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des scans lus:', error);
      }
    };

    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/checkAuth', { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      }
    };

    fetchRecentScans();
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setIsAuthenticated(false); // Réinitialiser l'état d'authentification
      setRecentScans([]); // Réinitialiser les scans
      navigate('/'); // Rediriger vers la page de connexion
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  const classicMangas = [
    { name: "Naruto", link: "/manga/naruto", image: "/images/naruto.jpg" },
    { name: "One Piece", link: "/manga/one-piece", image: "/images/one-piece.jpg" },
    { name: "Fullmetal Alchemist", link: "/manga/fullmetal-alchimiste", image: "/images/fullmetal-alchemist.jpg" },
    { name: "My Hero Academia", link: "/manga/my-hero-academia", image: "/images/my-hero-academia.jpg" }
  ];

  return (
    <div className="container text-light">
      <div className="manga-links mb-4">
        <h2>Les classiques :</h2>
        <div className="row">
          {classicMangas.map((manga, index) => (
            <div key={index} className="col-md-3">
              <div className="card mb-4">
                <img src={manga.image} className="card-img-top" alt={manga.name} />
                <div className="card-body">
                  <h5 className="card-title">{manga.name}</h5>
                  <Link to={manga.link} className="btn btn-primary">Lire</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-scans mb-4">
        <h2>Derniers scans lus :</h2>
        <ul className="list-group">
          {recentScans.length > 0 ? (
            recentScans.map((scan, index) => (
              <li key={index} className="list-group-item">
                <Link to={`/manga/${scan.mangaName}/${scan.scanName}`}>
                  {scan.mangaName} - {scan.scanName.slice(0, -4)}
                </Link>
              </li>
            ))
          ) : (
            <li className="list-group-item">Aucun scan lu récemment.</li>
          )}
        </ul>
      </div>

      {isAuthenticated && (
        <div className="logout">
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      )}
    </div>
  );
};

export default Home;
