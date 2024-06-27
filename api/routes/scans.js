// routes/scans.js
const express = require('express');
const db = require('../config/database');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const scanController = require('../controllers/scanController')

// Enregistrer un scan lu
router.post('/read', isAuthenticated, scanController.recordScan);

// Récupérer les derniers scans lus
router.get('/read', isAuthenticated, scanController.getRecentScans);

module.exports = router;
