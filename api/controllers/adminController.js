const fs = require('fs');
const path = require('path');
const escapeHtml = require('escape-html');

// const { User, Comment, Manga } = require('../models');
// const User = require('../models/user');
// const Comment = require('../models/comment');
// const Manga = require('../models/manga');
const multer = require('multer');



const db = require('../models')
// create main Model
const Comment = db.Comment
const CommentReply = db.CommentReply
const LikeComment = db.LikeComment
const User = db.User
const Manga = db.Manga;
const sequelize = db.sequelize;



// Configuration de multer pour enregistrer les images dans le dossier covers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'covers'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);  // Le nom du fichier sera initialement le nom original
    }
});

const upload = multer({ storage });

// Récupérer la liste des mangas
// exports.getMangas = (req, res) => {
//     const mangaFolderPath = path.join(__dirname, '..', 'Mangas');

//     fs.readdir(mangaFolderPath, (err, files) => {
//         if (err) {
//             console.error('Erreur lors de la lecture du dossier des mangas:', err);
//             return res.status(500).json({ error: 'Erreur lors de la lecture du dossier des mangas' });
//         }

//         const mangas = files.filter(file => fs.statSync(path.join(mangaFolderPath, file)).isDirectory());
//         res.json(mangas);
//     });
// };


exports.getMangas = async (req, res) => {
    try {
        const mangas = await Manga.findAll();
        res.json(mangas);
    } catch (error) {
        console.error('Erreur lors de la récupération des mangas:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des mangas' });
    }
};


// Récupérer les détails d'un manga spécifique
exports.getMangaByName = async (req, res) => {
    const { mangaName } = req.params;
    const mangaFolderPath = path.join(__dirname, '..', 'Mangas', mangaName);

    try {
        const files = await fs.promises.readdir(mangaFolderPath);

        const manga = await Manga.findOne({ where: { name: mangaName } });
        if (!manga) {
            return res.status(404).json({ error: 'Manga non trouvé' });
        }

        const synopsis = escapeHtml(manga.synopsis || '');
        const coverImage = manga.coverImage ? path.join('/api', manga.coverImage) : null;
        const mangaDetails = {
            name: mangaName,
            synopsis: synopsis,
            coverImage : coverImage,
            scans: files
        };

        res.json(mangaDetails);
    } catch (err) {
        console.error('Erreur lors de la récupération des détails du manga:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des détails du manga' });
    }
};


exports.addManga = [
    upload.single('coverImage'),
    async (req, res) => {
        const mangaName = escapeHtml(req.body.mangaName);
        const synopsis = escapeHtml(req.body.synopsis);
        const coverImage = req.file ? req.file.filename : null;

        if (coverImage) {
            // Déplacer/renommer l'image pour qu'elle ait le nom du manga
            const newCoverImagePath = path.join(__dirname, '..', 'covers', `${mangaName}.png`);
            fs.rename(path.join(__dirname, '..', 'covers', coverImage), newCoverImagePath, async (err) => {
                if (err) {
                    console.error('Erreur lors du déplacement de l\'image de couverture:', err);
                    res.status(500).json({ error: 'Erreur lors du déplacement de l\'image de couverture' });
                    return;
                }

                const mangaFolderPath = path.join(__dirname, '..', 'mangas', mangaName);
                fs.mkdir(mangaFolderPath, { recursive: true }, async (err) => {
                    if (err) {
                        console.error('Erreur lors de la création du dossier du manga:', err);
                        res.status(500).json({ error: 'Erreur lors de la création du dossier du manga' });
                        return;
                    }

                    try {
                        await Manga.create({ 
                            name: mangaName, 
                            synopsis, 
                            coverImage: `/covers/${mangaName}.png` 
                        });
                        res.status(201).json({ message: 'Manga ajouté avec succès' });
                    } catch (err) {
                        console.error('Erreur lors de l\'ajout du manga à la base de données:', err);
                        res.status(500).json({ error: 'Erreur lors de l\'ajout du manga à la base de données' });
                    }
                });
            });
        } else {
            const mangaFolderPath = path.join(__dirname, '..', 'mangas', mangaName);
            fs.mkdir(mangaFolderPath, { recursive: true }, async (err) => {
                if (err) {
                    console.error('Erreur lors de la création du dossier du manga:', err);
                    res.status(500).json({ error: 'Erreur lors de la création du dossier du manga' });
                    return;
                }

                try {
                    await Manga.create({ 
                        name: mangaName, 
                        synopsis, 
                        coverImage: null 
                    });
                    res.status(201).json({ message: 'Manga ajouté avec succès' });
                } catch (err) {
                    console.error('Erreur lors de l\'ajout du manga à la base de données:', err);
                    res.status(500).json({ error: 'Erreur lors de l\'ajout du manga à la base de données' });
                }
            });
        }
    }
];

exports.deleteManga = async (req, res) => {
    const { mangaName } = req.params;

    const mangaFolderPath = path.join(__dirname, '..', 'Mangas', mangaName);
    fs.rm(mangaFolderPath, { recursive: true, force: true }, async (err) => {
        if (err) {
            console.error('Erreur lors de la suppression du dossier du manga:', err);
            res.status(500).json({ error: 'Erreur lors de la suppression du dossier du manga' });
            return;
        }

        try {
            await Manga.destroy({ where: { name: mangaName } });
            res.status(200).json({ message: 'Manga supprimé avec succès' });
        } catch (err) {
            console.error('Erreur lors de la suppression du manga de la base de données:', err);
            res.status(500).json({ error: 'Erreur lors de la suppression du manga de la base de données' });
        }
    });
};

exports.updateManga = async (req, res) => {
    const mangaName = escapeHtml(req.params.mangaName);
    const newMangaName = escapeHtml(req.body.newMangaName);
    const synopsis = escapeHtml(req.body.synopsis);

    const oldMangaPath = path.join(__dirname, '..', 'Mangas', mangaName);
    const newMangaPath = path.join(__dirname, '..', 'Mangas', newMangaName);

    fs.rename(oldMangaPath, newMangaPath, async (err) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du manga:', err);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du manga' });
            return;
        }

        try {
            await Manga.update({ name: newMangaName, synopsis }, { where: { name: mangaName } });
            res.status(200).json({ message: 'Manga mis à jour avec succès' });
        } catch (err) {
            console.error('Erreur lors de la mise à jour du manga dans la base de données:', err);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du manga dans la base de données' });
        }
    });
};

exports.addScan = (req, res) => {
    const mangaName = escapeHtml(req.body.mangaName);
    const scanName = escapeHtml(req.body.scanName);
    const pdf = req.file;

    if (!mangaName || !scanName || !pdf) {
        return res.status(400).json({ error: 'Nom du manga, nom du scan et fichier PDF requis' });
    }

    const mangaFolderPath = path.join(__dirname, '..', 'Mangas', mangaName);
    const pdfPath = path.join(mangaFolderPath, scanName + path.extname(pdf.originalname));

    fs.access(mangaFolderPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('Le dossier du manga n\'existe pas:', err);
            return res.status(400).json({ error: 'Le dossier du manga n\'existe pas' });
        }

        fs.rename(pdf.path, pdfPath, (err) => {
            if (err) {
                console.error('Erreur lors du déplacement du fichier PDF:', err);
                return res.status(500).json({ error: 'Erreur lors du déplacement du fichier PDF' });
            }

            res.status(201).json({ scanName });
        });
    });
};

exports.deleteScan = (req, res) => {
    const { mangaName, scanName } = req.params;

    const scanPath = path.join(__dirname, '..', 'Mangas', mangaName, scanName);

    fs.unlink(scanPath, (err) => {
        if (err) {
            console.error('Erreur lors de la suppression du scan:', err);
            return res.status(500).json({ error: 'Erreur lors de la suppression du scan' });
        }

        res.status(200).json({ message: 'Scan supprimé avec succès' });
    });
};

exports.updateScan = async (req, res) => {
    const mangaName = escapeHtml(req.params.mangaName);
    const scanName = escapeHtml(req.params.scanName);
    const newScanName = escapeHtml(req.body.newScanName);

    const oldScanPath = path.join(__dirname, '..', 'Mangas', mangaName, scanName);
    const newScanPath = path.join(__dirname, '..', 'Mangas', mangaName, newScanName);

    try {
        await fs.promises.rename(oldScanPath, newScanPath);
        res.status(200).json({ message: 'Scan mis à jour avec succès' });
    } catch (err) {
        console.error('Erreur lors de la mise à jour du scan:', err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du scan' });
    }
};


exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        console.log('Utilisateurs récupérés:', users); // Ajoutez ce log
        res.status(200).json(users);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const deletedUser = await User.destroy({
            where: { id: userId }
        });

        if (deletedUser === 0) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
            return;
        }

        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', err);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
};

exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const username = escapeHtml(req.body.username);
    const email = escapeHtml(req.body.email);
    const role = escapeHtml(req.body.role);

    try {
        const updatedUser = await User.update(
            { username, email, role },
            { where: { id: userId } }
        );

        if (updatedUser[0] === 0) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
            return;
        }

        res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
};



exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            attributes: ['id', 'comment'],
            include: [{
                model: User,
                attributes: ['username'],
                required: true // INNER JOIN par défaut
            }]
        });

        const formattedComments = comments.map(comment => ({
            id: comment.id,
            comment: escapeHtml(comment.comment),
            username: escapeHtml(comment.User.username)
        }));

        res.status(200).json(formattedComments); // Ajoutez un statut HTTP pour la réponse
    } catch (err) {
        console.error('Erreur lors de la récupération des commentaires:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des commentaires' });
    }
};


exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const deletedRowCount = await Comment.destroy({
            where: { id: commentId }
        });

        if (deletedRowCount === 0) {
            res.status(404).json({ error: 'Commentaire non trouvé' });
            return;
        }

        res.status(200).json({ message: 'Commentaire supprimé avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression du commentaire:', err);
        res.status(500).json({ error: 'Erreur lors de la suppression du commentaire' });
    }
};