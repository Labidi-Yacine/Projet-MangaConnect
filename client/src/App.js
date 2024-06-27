import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import Home from "./components/Home.js";
import NotFound from "./components/NotFound.js";
import Catalogue from "./components/Catalogue.js";
import Mangaread from './components/Mangaread.js';
import Manga from './components/Manga.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Profil from './components/Profil.js';
import Header from './components/Header';
import AdminDashboard from './components/AdminDashboard';
import "./App.css";

function App() {
  const [loggedInUser, setLoggedInUser] = useState('');

  useEffect(() => {
    fetch('/api/auth/checkAuth', {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data.isAuthenticated) {
        setLoggedInUser(data.username);
        localStorage.setItem('user', JSON.stringify({ username: data.username, isAdmin: data.isAdmin }));
      }
    });
  }, []);

  return (
    <Router>
      <MainApp loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
    </Router>
  );
}

function MainApp({ loggedInUser, setLoggedInUser }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminRoute && <Header loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/manga/:mangaName" element={<Manga />} />
          <Route path="/manga/:mangaName/:scan" element={<Mangaread />} />
          <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes> 
      </div>
    </div>
  );
}

export default App;
