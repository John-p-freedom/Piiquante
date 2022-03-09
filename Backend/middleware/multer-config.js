//Importation de multer
const multer = require('multer');

//Ajoute l'extension approprié sur le fichier envoyé
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Constante qui indique où enregister les fichiers entrant
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//Exportation de multer
module.exports = multer({storage: storage}).single('image');