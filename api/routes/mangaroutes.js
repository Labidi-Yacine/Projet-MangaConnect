const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/mangaController');

// Récupérer tous les mangas
router.get('/all', mangaController.getAllMangas);

// Récupérer les détails d'un manga spécifique, y compris les scans et le synopsis
router.get('/:mangaName/scans', mangaController.getMangaDetails);

module.exports = router;
