// manga-onlinetest/app/server/routes/authRoutes.js

const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
    '/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Le mot de passe doit contenir au moins un nombre, une majuscule et un caractère spécial et faire au moins 12 caractères').matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{12,}$/)
        ],
    authController.register
);

router.post('/login', authController.login);

router.get('/checkAuth', authController.checkAuth); // Nouvelle route pour vérifier l'authentification

router.post('/logout', authController.logout); // Nouvelle route pour la déconnexion



router.put(
    '/updateUserInfo',
    [
        check('username', 'Username is required').optional().not().isEmpty(),
        check('password', 'Le mot de passe doit contenir au moins un nombre, une majuscule et un caractère spécial et faire au moins 12 caractères').optional().matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{12,}$/)
    ],
    authController.updateUserInfo
);


module.exports = router;
