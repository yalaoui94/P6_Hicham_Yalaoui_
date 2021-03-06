const express = require('express');// importation d'express
const mongoose = require('mongoose'); // importation de mongoose 
const path = require('path'); // Importation de node qui nous donne le chemain 
const saucesRoutes = require('./routes/sauces'); //importation de sauceRoutes 
const userRoutes = require('./routes/user'); //importation de userRoutes


/***********************************/ 
// connexion à la base de Données//

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();


// controle CORS pour acceder au front//

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//---intercepte toutes les requêtes qui contiennent du JSON pour le mettre à disposition sur l'objet requête dans req.body
// remplace body parser

app.use(express.json());
//*** express.json middleware****//
// les routes attendu par le front//
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;