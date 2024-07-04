// const LikeComment = require('../models/likecomment');
// const LikeManga = require('../models/likemanga')



const db = require('../models')
const LikeComment = db.LikeComment; // Corrigé ici
const LikeManga = db.LikeManga; // Corrigé ici
const User = db.User;
const escapeHtml = require('escape-html');



exports.addOrRemoveLikeForComment = async (req, res) => {
    try {
        const { commentId } = req.body;
        const userId = req.session.user.id;

        const existingLike = await LikeComment.findOne({ where: { comment_id: commentId, user_id: userId } });

        if (existingLike) {
            await existingLike.destroy();
            res.status(200).json({ message: 'Like pour le commentaire supprimé avec succès' });
        } else {
            const newLike = await LikeComment.create({ comment_id: commentId, user_id: userId });
            res.status(201).json({ id: newLike.id, commentId, userId });
        }
    } catch (err) {
        console.error('Erreur lors de la gestion du like pour le commentaire:', err);
        res.status(500).json({ error: 'Erreur lors de la gestion du like pour le commentaire' });
    }
};


exports.addOrRemoveLikeForManga = async (req, res) => {
    try {
        const { mangaName } = req.body;
        const userId = req.session.user.id;

        const existingLike = await LikeManga.findOne({ where: { mangaName: escapeHtml(mangaName), userId: userId } });

        if (existingLike) {
            await existingLike.destroy();
            res.status(200).json({ message: 'Like pour le manga supprimé avec succès' });
        } else {
            const newLike = await LikeManga.create({ mangaName: escapeHtml(mangaName), userId: userId });
            res.status(201).json({ id: newLike.id, mangaName, userId });
        }
    } catch (err) {
        console.error('Erreur lors de la gestion du like pour le manga:', err);
        res.status(500).json({ error: 'Erreur lors de la gestion du like pour le manga' });
    }
};

exports.getLikedMangas = async (req, res) => {
    try {
        const userId = req.session.user.id;
        console.log('User ID from session:', userId);


        const likedMangas = await LikeManga.findAll({ where: { userId } });
        res.json(likedMangas.map(like => ({
            id: like.id,
            mangaName: escapeHtml(like.mangaName),
            userId: like.userId
        })));
    } catch (err) {
        console.error('Erreur lors de la récupération des mangas likés:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des mangas likés' });
    }
};
