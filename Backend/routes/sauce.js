//Création d'un routeur express
const express = require('express');
const router = express.Router();

//Importation de la route controllers
const sauceCtrl = require('../controllers/sauce');

//Importation de la route d'authentification
const auth = require('../middleware/auth');

//Importation de multer
const multer = require('../middleware/multer-config');

//Importation des middlewares depuis le controllers
router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeOrDislike);

//Exportation du routeur
module.exports = router;