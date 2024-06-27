// routes/adminRoutes.js
const express = require('express');
const adminController = require('../controllers/adminController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');
const multer = require('multer');
const db = require('../config/database');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Dossier temporaire pour les fichiers uploadés


// Manga routes
router.get('/mangas', isAuthenticated, isAdmin, adminController.getMangas); // Nouvelle route pour récupérer les mangas
router.post('/mangas', isAuthenticated, isAdmin, adminController.addManga);
router.delete('/mangas/delete/:mangaName', isAuthenticated, isAdmin, adminController.deleteManga);
router.put('/mangas/update/:mangaName', isAuthenticated, isAdmin, adminController.updateManga);

// Nouvelle route pour récupérer les données d'un manga spécifique
router.get('/mangas/:mangaName', isAuthenticated, isAdmin, adminController.getMangaByName);

 
// Scan routes
router.post('/scans/add', isAuthenticated, isAdmin, upload.single('pdf'), adminController.addScan);
router.delete('/scans/delete/:mangaName/:scanName', isAuthenticated, isAdmin, adminController.deleteScan);
router.put('/scans/update/:mangaName/:scanName', isAuthenticated, isAdmin, adminController.updateScan);
// // User routes
router.get('/users', isAuthenticated, isAdmin, adminController.getUsers);
router.delete('/users/delete/:userId', isAuthenticated, isAdmin, adminController.deleteUser);
router.put('/users/update/:userId', isAuthenticated, isAdmin, adminController.updateUser);

// // Comment routes
router.delete('/comments/delete/:commentId', isAuthenticated, isAdmin, adminController.deleteComment);
router.get('/comments', isAuthenticated, isAdmin, adminController.getComments);  


module.exports = router;
