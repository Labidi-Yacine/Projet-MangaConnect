// /api/controllers/scanController.js
// const ScansRead = require('../models/scanread');

const escapeHtml = require('escape-html');

const db = require('../models')
// create main Model
const ScanRead = db.ScanRead



const { validationResult } = require('express-validator');

exports.recordScan = async (req, res) => {
    console.log('Received scan record request:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { mangaName, scanName } = req.body;
    const userId = req.session.user.id;

    console.log('User ID from session:', userId);


    try {
        const scan = await ScanRead.create({ mangaName, scanName, userId });
        console.log('Scan enregistré:', { mangaName, scanName, userId });
        res.status(201).json({ id: scan.id, mangaName, scanName, userId });
    } catch (err) {
        console.error('Erreur lors de l\'enregistrement du scan lu:', err);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement du scan lu' });
    }
};

exports.getRecentScans = async (req, res) => {
    console.log('Received request to get recent scans');

    const userId = req.session.user.id;

    console.log('User ID from session:', userId);


    try {
        const scans = await ScanRead.findAll({
            where: { userId },
            order: [['created_at']],
            limit: 10
        });
        console.log('Scans récupérés:', scans);
        res.json(scans);        
    } catch (err) {
        console.error('Erreur lors de la récupération des scans lus:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des scans lus' });
    }
};
