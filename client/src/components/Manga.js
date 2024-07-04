import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from 'axios';

const Manga = () => {
  const { mangaName } = useParams();
  const [scans, setScans] = useState([]);
  const [synopsis, setSynopsis] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    axios.get(`/api/mangas/${mangaName}/scans`)
      .then(response => {
        const data = response.data;
        if (data) {
          setScans(data.scans || []);
          setSynopsis(data.synopsis || '');
          setCoverImage(data.coverImage || '');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des scans du manga:', error);
        setScans([]);
      });

    axios.get('/api/likes/manga/liked', { withCredentials: true })
      .then(response => {
        const likedMangas = response.data.map(like => like.mangaName.toLowerCase());
        setLiked(likedMangas.includes(mangaName.toLowerCase()));
      })
      .catch(err => console.error('Erreur lors de la vérification du like pour le manga:', err));
  }, [mangaName]);

  const handleToggleLikeManga = () => {
    axios.post('/api/likes/manga/like', { mangaName }, { withCredentials: true })
      .then(() => setLiked(!liked))
      .catch(err => console.error('Erreur lors du like pour le manga:', err));
  };

  const handleScanClick = (scan) => {
    axios.post('/api/scans/read', { mangaName, scanName: scan }, { withCredentials: true })
      .catch(err => console.error('Erreur lors de l\'enregistrement du scan lu:', err));
  };

  return (
    <div className="container full-height flex-column text-light">
      
      <h1 className="text-center my-4">Manga: {mangaName}</h1>
      {coverImage && (
        <div className="text-center mb-4">
          <img src={coverImage} alt={`${mangaName} cover`} style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
      <p className="text-light my-4">{synopsis}</p>
      <button 
        className="btn btn-link p-0 mb-4"
        onClick={handleToggleLikeManga}
        style={{ border: 'none', background: 'none', color: liked ? 'red' : 'gray', fontSize: '1.5rem' }}
      >
        <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
      </button>
      <div className="mt-5">
        <h2>Scans :</h2>
        <ul className="list-group">
          {scans.length > 0 ? (
            scans.map((scan, index) => (
              <li key={index} className="list-group-item">
                <Link 
                  to={`/manga/${mangaName}/${scan}`} 
                  onClick={() => handleScanClick(scan)}
                  className="text-decoration-none"
                >
                  {scan.slice(0, -4)}
                </Link>
              </li>
            ))
          ) : (
            <li className="list-group-item">Aucun scan disponible.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Manga;
