//Création d'un routeur express
const express = require('express');
const router = express.Router();

//Importation de la route controllers
const userCtrl = require('../controllers/user');

//Importation des middlewares depuis le controllers
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//Exportation du routeur
module.exports = router;