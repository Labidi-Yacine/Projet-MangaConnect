// middleware/isAuthenticated.js
module.exports = (req, res, next) => {
    if (req.session.user && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
