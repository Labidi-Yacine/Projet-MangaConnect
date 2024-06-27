const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../config/database');
const User = require('../models/user')

//inscription
exports.register = async (req, res) => {
    console.log('Received register request:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, isAdmin } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            isAdmin: isAdmin || false
        });

        console.log('User registered successfully:', newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log(`Attempting login for email: ${email}`);

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log('No user found with that email');
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        console.log(`Found user: ${user.username}`);

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        };

        res.status(200).json({ message: 'Logged in successfully', user: req.session.user });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Vérification de l'état de connexion
exports.checkAuth = (req, res) => {
    if (req.session.user) {
        const { username, email, isAdmin } = req.session.user;
        res.status(200).json({ isAuthenticated: true, username, email, isAdmin });
    } else {
        res.status(401).json({ isAuthenticated: false, message: 'Utilisateur non authentifié' });
    }
};

// Déconnexion de l'utilisateur
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

exports.updateUserInfo = async (req, res) => {
    console.log('Received update request:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const userId = req.session.user.id;

    try {
        if (username) {
            await User.update({ username }, { where: { id: userId } });
            req.session.user.username = username;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.update({ password: hashedPassword }, { where: { id: userId } });
        }

        res.status(200).json({ message: 'User info updated successfully', username: req.session.user.username });
    } catch (err) {
        console.error('Error updating user info:', err);
        res.status(500).json({ error: 'Server error' });
    }
};