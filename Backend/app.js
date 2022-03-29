//Importation de l'application express
const express = require('express');

//Importation de la sécurité helmet
const helmet = require('helmet');

//Importation de mongoose
const mongoose = require('mongoose');

//Importation du path du server
const path = require('path');

//Importation de la route sauces
const sauceRoutes = require('./routes/sauce');

//Importation de la route user
const userRoutes = require('./routes/user');

//Envoi le contenu du fichier .env dans l'object process.env
require('dotenv').config()

//Paramètre de connection mongoDB
mongoose.connect((process.env.MONGO_URI),
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Appel de l'application express et de sa sécurité
const app = express();

//Middleware qui permet la communication entre des serveurs différents
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8081');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Middleware d'extraction du corp json
app.use(express.json());

//Middleware d'application de helmet pour express
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

//Middleware de récupération des images
app.use('/images', express.static(path.join(__dirname, 'images')));

//Middleware de récupération de la route sauce
app.use('/api/sauces', sauceRoutes);

//Middleware de récupération de la route user
app.use('/api/auth', userRoutes);

//Exportation du fichier app
module.exports = app;