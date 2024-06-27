// middleware/isAdmin.js
module.exports = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Accès interdit: administrateurs seulement' });
    }
};
