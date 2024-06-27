import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Catalogue = () => {
  const [mangas, setMangas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/api/mangas/all')
      .then(response => {
        setMangas(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des mangas:', error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMangas = mangas.filter(manga => 
    manga.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5 text-light">
      <h1 className="text-center mb-4">Catalogue des Mangas</h1>
      {/* <nav>
        <ul className="nav nav-pills justify-content-center mb-4">
          <li className="nav-item">
            <Link className="nav-link" to="/">Accueil</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/recent">Nouveauté</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/catalogue">Catalogue</Link>
          </li>
        </ul>
      </nav> */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher un manga"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="mt-5">
        <h2>Mangas disponibles:</h2>
        <ul className="list-group">
          {filteredMangas.length > 0 ? (
            filteredMangas.map((manga, index) => (
              <li key={index} className="list-group-item">
                <Link to={`/manga/${manga}`} className="text-decoration-none">
                  {manga}
                </Link>
              </li>
            ))
          ) : (
            <li className="list-group-item">Aucun manga disponible.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Catalogue;
