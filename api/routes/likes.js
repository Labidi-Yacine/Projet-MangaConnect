const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const likeController = require('../controllers/likeController');

// Ajouter un like pour un commentaire
router.post('/add', isAuthenticated, likeController.addOrRemoveLikeForComment);

// Ajouter ou supprimer un like pour un manga
router.post('/manga/like', isAuthenticated, likeController.addOrRemoveLikeForManga);

// Récupérer les mangas likés par l'utilisateur
router.get('/manga/liked', isAuthenticated, likeController.getLikedMangas);

module.exports = router;
