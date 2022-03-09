//Importation de mongoose
const mongoose = require('mongoose');

//Importation de mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

//Création d'un schéma pour enregister le mail et mot de passe d'un user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//Validateur pour vérifié qu'il n'y a qu'une seule adresse mail d'enregistré
userSchema.plugin(uniqueValidator);

//Exportation du schéma
module.exports = mongoose.model('User', userSchema);