const LikeComment = require('../models/likecomment');
const LikeManga = require('../models/likemanga')

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

        const existingLike = await LikeManga.findOne({ where: { mangaName, userId } });

        if (existingLike) {
            await existingLike.destroy();
            res.status(200).json({ message: 'Like pour le manga supprimé avec succès' });
        } else {
            const newLike = await LikeManga.create({ mangaName, userId });
            res.status(201).json({ id: newLike.id, mangaName, userId });
        }
    } catch (err) {
        console.error('Erreur lors de la gestion du like pour le manga:', err);
        res.status(500).json({ error: 'Erreur lors de la gestion du like pour le manga' });
    }
};

// exports.addLikeForManga = async (req, res) => {
//     try {
//         const { mangaName } = req.body;
//         const userId = req.session.user.id;

//         const newLike = await LikeManga.create({ mangaName, userId });
//         res.status(201).json({ id: newLike.id, mangaName, userId });
//     } catch (err) {
//         console.error('Erreur lors de l\'ajout du like pour le manga:', err);
//         res.status(500).json({ error: 'Erreur lors de l\'ajout du like pour le manga' });
//     }
// };

// exports.removeLikeForManga = async (req, res) => {
//     try {
//         const { mangaName } = req.body;
//         const userId = req.session.user.id;

//         await LikeManga.destroy({ where: { mangaName, userId } });
//         res.status(200).json({ message: 'Like pour le manga supprimé avec succès' });
//     } catch (err) {
//         console.error('Erreur lors de la suppression du like pour le manga:', err);
//         res.status(500).json({ error: 'Erreur lors de la suppression du like pour le manga' });
//     }
// };

exports.getLikedMangas = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const likedMangas = await LikeManga.findAll({ where: { userId } });
        res.json(likedMangas);
    } catch (err) {
        console.error('Erreur lors de la récupération des mangas likés:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des mangas likés' });
    }
};
