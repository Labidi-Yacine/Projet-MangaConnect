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
router.get('/mangas', isAuthenticated,  adminController.getMangas); // Nouvelle route pour récupérer les mangas
router.post('/mangas', isAuthenticated,  adminController.addManga);
router.delete('/mangas/delete/:mangaName', isAuthenticated,  adminController.deleteManga);
router.put('/mangas/update/:mangaName', isAuthenticated,  adminController.updateManga);

// Nouvelle route pour récupérer les données d'un manga spécifique
router.get('/mangas/:mangaName', isAuthenticated,  adminController.getMangaByName);

 
// Scan routes
router.post('/scans/add', isAuthenticated, upload.single('pdf'), adminController.addScan);
router.delete('/scans/delete/:mangaName/:scanName', isAuthenticated,  adminController.deleteScan);
router.put('/scans/update/:mangaName/:scanName', isAuthenticated, adminController.updateScan);
// // User routes
router.get('/users', isAuthenticated, adminController.getUsers);
router.delete('/users/delete/:userId', isAuthenticated,  adminController.deleteUser);
router.put('/users/update/:userId', isAuthenticated, adminController.updateUser);

// // Comment routes
router.delete('/comments/delete/:commentId', isAuthenticated,  adminController.deleteComment);
router.get('/comments', isAuthenticated, adminController.getComments);  


module.exports = router;
