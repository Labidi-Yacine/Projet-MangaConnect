const Comment = require('../models/comment');
const CommentReply = require('../models/commentreplies');
const LikeComment = require('../models/likecomment');
const User = require('../models/user');

exports.addComment = async (req, res) => {
    try {
        const { mangaName, scan, comment } = req.body;
        const userId = req.session.user.id;

        const newComment = await Comment.create({ mangaName, scan, userId, comment });

        res.status(201).json({
            id: newComment.id,
            mangaName,
            scan,
            userId,
            comment,
            created_at: new Date()
        });
    } catch (err) {
        console.error('Erreur lors de l\'ajout du commentaire:', err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire' });
    }
};

exports.getCommentsWithReplies = async (req, res) => {
    try {
        const { mangaName, scan } = req.params;
        const userId = req.session?.user?.id;

        const comments = await Comment.findAll({
            where: { mangaName, scan },
            include: [{ model: User, attributes: ['username'] }]
        });

        const commentIds = comments.map(comment => comment.id);
        if (commentIds.length === 0) {
            res.json(comments);
            return;
        }

        const replies = await CommentReply.findAll({
            where: { comment_id: commentIds },
            include: [{ model: User, attributes: ['username'] }]
        });

        if (userId) {
            const likedComments = await LikeComment.findAll({
                where: { comment_id: commentIds, user_id: userId }
            });

            const likedCommentIds = likedComments.map(like => like.comment_id);

            const commentsWithReplies = comments.map(comment => {
                return {
                    ...comment.get(),
                    liked: likedCommentIds.includes(comment.id),
                    replies: replies.filter(reply => reply.comment_id === comment.id)
                };
            });

            res.json(commentsWithReplies);
        } else {
            const commentsWithReplies = comments.map(comment => {
                return {
                    ...comment.get(),
                    liked: false,
                    replies: replies.filter(reply => reply.comment_id === comment.id)
                };
            });

            res.json(commentsWithReplies);
        }
    } catch (err) {
        console.error('Erreur lors de la récupération des commentaires:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des commentaires' });
    }
};

exports.getUserReplies = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const replies = await CommentReply.findAll({ where: { user_id: userId } });

        res.json(replies);
    } catch (err) {
        console.error('Erreur lors de la récupération des réponses de l\'utilisateur:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des réponses de l\'utilisateur' });
    }
};

exports.deleteUserReply = async (req, res) => {
    try {
        const { replyId } = req.params;

        await CommentReply.destroy({ where: { id: replyId } });

        res.status(200).json({ message: 'Réponse supprimée avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression de la réponse:', err);
        res.status(500).json({ error: 'Erreur lors de la suppression de la réponse' });
    }
};

exports.getUserComments = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const comments = await Comment.findAll({ where: { userId } });

        res.json(comments);
    } catch (err) {
        console.error('Erreur lors de la récupération des commentaires de l\'utilisateur:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des commentaires de l\'utilisateur' });
    }
};

exports.deleteUserComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        await CommentReply.destroy({ where: { comment_id: commentId } });
        await LikeComment.destroy({ where: { comment_id: commentId } });
        await Comment.destroy({ where: { id: commentId } });

        res.status(200).json({ message: 'Commentaire supprimé avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression du commentaire:', err);
        res.status(500).json({ error: 'Erreur lors de la suppression du commentaire' });
    }
};

exports.getTopLikedComments = async (req, res) => {
    try {
        const { mangaName, scan } = req.params;
        console.log('Fetching top liked comments for:', mangaName, scan);

        const comments = await Comment.findAll({
            where: { mangaName, scan },
            include: [
                { model: User, attributes: ['username'] },
                {
                    model: LikeComment,
                    attributes: []
                }
            ],
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('LikeComments.id')), 'likesCount']
                ]
            },
            group: ['Comment.id', 'User.id'],
            order: [
                [sequelize.literal('likesCount'), 'DESC'],
                ['created_at', 'DESC']
            ],
            limit: 10
        });

        console.log('Fetched comments:', comments);
        res.json(comments);
    } catch (err) {
        console.error('Erreur lors de la récupération des commentaires les plus likés:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des commentaires les plus likés' });
    }
};

exports.addReply = async (req, res) => {
    try {
        const { commentId, reply } = req.body;
        const userId = req.session.user.id;

        const newReply = await CommentReply.create({ comment_id: commentId, user_id: userId, reply });

        res.status(201).json({
            id: newReply.id,
            commentId,
            userId,
            reply,
            created_at: new Date()
        });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de la réponse:', err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la réponse' });
    }
};
