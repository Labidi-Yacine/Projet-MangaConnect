// middleware/isAdmin.js
module.exports = (req, res, next) => {
    console.log('Admin Check:', req.session.user); // Log de la vérification admin
    if (req.session.user && req.session.user.isAdmin === 1) {
        return next();
    } else {
        res.status(403).json({ message: 'Accès interdit: administrateurs seulement' });
    }
};
