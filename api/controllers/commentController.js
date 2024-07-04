// const Comment = require('../models/comment');
// const CommentReply = require('../models/commentreplies');
// const LikeComment = require('../models/likecomment');
// const User = require('../models/user');
// const { Op, fn, col } = require('sequelize');




const db = require('../models')
// create main Model
const Comment = db.Comment
const CommentReply = db.CommentReply
const LikeComment = db.LikeComment
const User = db.User
const sequelize = db.sequelize; // Accéder à l'instance de Sequelize à partir de l'objet db
const escapeHtml = require('escape-html');







exports.addComment = async (req, res) => {
    try {
        const { mangaName, scan, comment } = req.body;
        const userId = req.session.user.id;

        const newComment = await Comment.create({ 
            mangaName: escapeHtml(mangaName),
            scan: escapeHtml(scan), 
            userId, 
            comment: escapeHtml(comment)
        });

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


exports.getCommentWithRepliesAndLike = async (req, res) => {
    const { mangaName, scan } = req.params;

    try {
        const comments = await Comment.findAll({
            where: {
                mangaName: escapeHtml(mangaName),
                scan: escapeHtml(scan)
            },
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['username']
                },
                {
                    model: CommentReply,
                    as: 'CommentReplies',
                    include: {
                        model: User,
                        as: 'User',
                        attributes: ['username']
                    }
                },
                {
                    model: LikeComment,
                    as: 'LikeComments'
                }
            ],
            order: [['createdAt', 'ASC']]
        });

        const userId = req.session.user ? req.session.user.id : null;

        const formattedComments = comments.map(comment => {
            return {
                id: comment.id,
                mangaName: comment.mangaName,
                scan: comment.scan,
                userId: comment.userId,
                comment: escapeHtml(comment.comment),
                created_at: comment.createdAt,
                username: comment.User ? comment.User.username : 'Unknown User',
                liked: userId ? comment.LikeComments.some(like => like.userId === userId) : false,
                replies: comment.CommentReplies.map(reply => ({
                    id: reply.id,
                    commentId: reply.commentId,
                    userId: reply.userId,
                    reply: escapeHtml(reply.reply),
                    created_at: reply.createdAt,
                    username: reply.User ? reply.User.username : 'Unknown User'
                }))
            };
        });

        res.json(formattedComments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




exports.getUserReplies = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const replies = await CommentReply.findAll({ where: { user_id: userId } });

        res.json(replies.map(reply => ({
            id: reply.id,
            commentId: reply.commentId,
            userId: reply.userId,
            reply: escapeHtml(reply.reply)
        })));
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
        const comments = await Comment.findAll({ where: { user_id: userId } });

        res.json(comments.map(comment => ({
            id: comment.id,
            mangaName: comment.mangaName,
            scan: comment.scan,
            userId: comment.userId,
            comment: escapeHtml(comment.comment),
            created_at: comment.createdAt
        })));
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

// exports.getTopLikedComments = async (req, res) => {
//     try {
//         const { mangaName, scan } = req.params;
//         console.log('Fetching top liked comments for:', mangaName, scan);

//         const comments = await Comment.findAll({
//             where: { mangaName: escapeHtml(mangaName), scan: escapeHtml(scan)},
//             include: [
//                 { model: User, attributes: ['username'] },
//                 {
//                     model: LikeComment,
//                     attributes: []
//                 }
//             ],
//             attributes: {
//                 include: [
//                     [sequelize.fn('COUNT', sequelize.col('id')), 'likesCount']
//                 ]
//             },
//             group: ['Comment.id', 'User.id'],
//             order: [
//                 [sequelize.literal('likesCount'), 'DESC'],
//                 ['createdAt', 'DESC'] // 'created_at' doit correspondre au nom de l'attribut dans votre modèle
//             ],
//             limit: 10
//         });

//         console.log('Fetched comments:', comments);
//         res.json(comments);
//     } catch (err) {
//         console.error('Erreur lors de la récupération des commentaires les plus likés:', err);
//         res.status(500).json({ error: 'Erreur lors de la récupération des commentaires les plus likés' });
//     }
// };

exports.getTopLikedComments = async (req, res) => {
    const { mangaName, scan } = req.params;

    try {
        // Query to get comments along with their like count, ordered by like count
        const comments = await Comment.findAll({
            where: {
                mangaName: escapeHtml(mangaName),
                scan: escapeHtml(scan)
            },
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM likes_comments AS like_comments
                            WHERE like_comments.comment_id = Comment.id
                        )`),
                        'likeCount'
                    ]
                ]
            },
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['username']
                }
            ],
            order: [[sequelize.literal('likeCount'), 'DESC']],
            limit: 5 // Adjust the limit as needed
        });

        const formattedComments = comments.map(comment => ({
            id: comment.id,
            mangaName: comment.mangaName,
            scan: comment.scan,
            userId: comment.userId,
            comment: escapeHtml(comment.comment),
            created_at: comment.createdAt,
            username: comment.User ? comment.User.username : 'Unknown User',
            likeCount: comment.dataValues.likeCount
        }));

        res.json(formattedComments);
    } catch (error) {
        console.error('Error fetching top liked comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.addReply = async (req, res) => {
    try {
        const { commentId, reply } = req.body;
        const userId = req.session.user.id;
        console.log('Adding reply with commentId:', commentId, 'userId:', userId);

        const newReply = await CommentReply.create({
            commentId,  // Assurez-vous que cela correspond bien à votre modèle
            userId,     // Assurez-vous que cela correspond bien à votre modèle
            reply: escapeHtml(reply)
        });


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
