const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const commentController = require('../controllers/commentController');

// Ajouter un nouveau commentaire (authentifié)
router.post('/add', isAuthenticated, commentController.addComment);

// Récupérer les commentaires et leurs réponses, incluant l'état "liked" (authentifié ou non)
router.get('/:mangaName/:scan', commentController.getCommentsWithReplies);

// Récupérer les réponses d'un utilisateur (authentifié)
router.get('/replies', isAuthenticated, commentController.getUserReplies);

// Supprimer une réponse d'utilisateur (authentifié)
router.delete('/replies/:replyId', isAuthenticated, commentController.deleteUserReply);

// Récupérer les commentaires de l'utilisateur connecté (authentifié)
router.get('/comments', isAuthenticated, commentController.getUserComments);

// Supprimer un commentaire de l'utilisateur (authentifié)
router.delete('/comments/:commentId', isAuthenticated, commentController.deleteUserComment);

// Récupérer les commentaires les plus likés pour un scan spécifique (authentifié ou non)
router.get('/:mangaName/:scan/top-liked', commentController.getTopLikedComments);

// Ajouter une réponse à un commentaire (authentifié)
router.post('/reply/add', isAuthenticated, commentController.addReply);

module.exports = router;
