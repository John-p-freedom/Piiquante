//Importation du model sauce
const Sauce = require('../models/sauce');

//Importation du file system
const fs = require('fs');

//Middleware de récupération des sauces dans la bdd
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
}

//Middleware de récupération d'une sauce spécifique dans la bdd
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
}

//Middleware de creation des sauces dans la bdd 
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
    .catch((error) => res.status(400).json({ error }));
};

//Middleware de modification d'une sauce spécifique
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) { //si la requête est présenter par le même id que celui qui l'a poster => error
        res.status(403).json({ error: "Requête non autorisée" });
      }
      if (req.file) { //si une image existe => supression de l'image
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlinkSync(`images/${filename}`);
      }
      const sauceObject = req.file ? //vérifie si une image existe et applique les paramètres de modification
          {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
          } : { ...req.body };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce modifiée." }))
        .catch((error) => res.status(400).json({ error }));
  })
  .catch((error) => res.status(400).json({ error }));
};

//Middleware de suppression d'une sauce spécifique
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ error: "Requête non autorisé" });
      } else if (sauce.userId == req.auth.userId) {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

//Middleware de gestion des likes ou dislikes
exports.likeOrDislike = (req, res, next) => {
  if (req.body.like === 1) {
    Sauce.updateOne({ _id: req.params.id },
      {
        $inc: { likes: req.body.like++ }, //$inc = incorpore les éléments rentrer en paramètre
        $push: { usersLiked: req.body.userId },
      })
      .then((sauce) => res.status(200).json({ message: "Ajout Like" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (req.body.like === -1) {
    Sauce.updateOne({ _id: req.params.id },
      {
        $inc: { dislikes: req.body.like++ * -1 },
        $push: { usersDisliked: req.body.userId }, //$push = ajoute l'id sur le like ou dislike
      })
      .then((sauce) => res.status(200).json({ message: "Ajout Dislike" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id },
            { 
              $pull: { usersLiked: req.body.userId }, //$pull = supprime l'id sur le like ou le dislike
              $inc: { likes: -1 } 
            })
            .then((sauce) => {res.status(200).json({ message: "Suppression Like" });})
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            })
            .then((sauce) => {res.status(200).json({ message: "Suppression Dislike" });})
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};