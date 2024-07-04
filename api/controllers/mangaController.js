const path = require('path');
const fs = require('fs');
const escapeHtml = require('escape-html');

// const Manga = require('../models/manga');



const db = require('../models')
// create main Model
const Manga = db.Manga



exports.getAllMangas = (req, res) => {
    const mangaFolderPath = path.join(__dirname, '..', 'Mangas');

    fs.readdir(mangaFolderPath, (err, files) => {
        if (err) {
            console.error('Erreur lors de la lecture du dossier des mangas:', err);
            return res.status(500).json({ error: 'Erreur lors de la lecture du dossier des mangas' });
        }

        const mangas = files.filter(file => fs.statSync(path.join(mangaFolderPath, file)).isDirectory());
        res.json(mangas);
    });
};

exports.getMangaDetails = async (req, res) => {
    try {
        const mangaName = escapeHtml(req.params.mangaName);
        const mangaFolderPath = path.join(__dirname, '..', 'Mangas', mangaName);

        // Check if manga directory exists
        if (!fs.existsSync(mangaFolderPath)) {
            return res.status(404).json({ error: 'Manga non trouvé' });
        }

        fs.readdir(mangaFolderPath, async (err, files) => {
            if (err) {
                console.error('Erreur lors de la lecture du dossier du manga:', err);
                return res.status(500).json({ error: 'Erreur lors de la lecture du dossier du manga' });
            }

            const manga = await Manga.findOne({ where: { name: mangaName } });

            if (!manga) {
                return res.status(404).json({ error: 'Manga non trouvé' });
            }

            const synopsis = manga.synopsis || '';
            res.json({ scans: files, synopsis, coverImage: manga.coverImage });
        });
    } catch (err) {
        console.error('Erreur lors de la récupération des détails du manga:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des détails du manga' });
    }
};
