const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const rateLimit = require('express-rate-limit'); // Ajouter express-rate-limit
const sequelize = require('./config/sequelize');
const db = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const mangaroutes = require('./routes/mangaroutes');
const scansRoutes = require('./routes/scans');
const adminRoutes = require('./routes/adminRoutes');



const app = express();
const port = 3001;


// Configure Express pour faire confiance aux en-têtes proxy
app.set('trust proxy', 1);


app.use(cors({
    origin: 'http://localhost:3000', // Ici 'http://localhost:3000' sera modifié par le domaine de mon app front-end
    credentials: true
}));


// app.use(cookieParser());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sessionStore = new SequelizeStore({
    db: sequelize
});

app.use(session({
    secret: 'your_secret_key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

sessionStore.sync();

// Synchronisation des modèles avec la base de données
sequelize.sync()
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch(err => {
    console.error('Error synchronizing models:', err);
  });

// Configuration de express-rate-limit
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // 5 tentatives max
//   message: "Trop de tantative de connexion pour cet ip ! Réessayez plus tard."
// });

// express-rate-limit seulement sur les routes d'authentification
// app.use('/api/auth', limiter);

// Configuration de csurf pour générer et vérifier les tokens CSRF
// const csrfProtection = csurf({ cookie: true });

// app.use(csrfProtection);

// // Middleware pour ajouter le token CSRF aux réponses
// app.use((req, res, next) => {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   next();
// });

app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/mangas', mangaroutes);
app.use('/api/scans', scansRoutes);
app.use('/api/admin', adminRoutes);

// Servir les fichiers statiques des scans et des images de couverture
app.use('/Mangas', express.static(path.join(__dirname, 'Mangas')));
app.use('/Covers', express.static(path.join(__dirname, 'covers')));

// Servir les fichiers statiques de l'application React
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// app.get('/Mangas/:mangaName/:scan', (req, res) => {
//     const { mangaName, scan } = req.params;
//     const scanFilePath = path.join(__dirname, 'Mangas', mangaName, scan);

//     res.sendFile(scanFilePath, err => {
//         if (err) {
//             console.error('Erreur lors de l\'envoi du fichier de scan:', err);
//             res.status(500).json({ error: 'Erreur lors de l\'envoi du fichier de scan' });
//         }
//     });
// });

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
