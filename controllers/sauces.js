const Sauce = require('../models/modelsSauce'); // recuperation du mondele mangouste pour nos sauces//
const fs = require('fs');// supprimer les images //


// --------- CRÉER/ENREGISTRER UNE SAUCE ----------
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
      .catch(error => res.status(400).json({ error }));
};

// --------- Modification de la SAUCE ----------

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body};
    Sauce.updateOne({ _id: req.params.id, userId: req.auth.userId}, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

// --------- Supprimer la sauce  ----------

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id, userId: req.auth.userId}).then
        (sauce => {
            // ---------- empecher qu'un utilisateur supprime une sauce ---------

            if (!sauce) {
                res.status(404).json({
                  error: new Error('No such Sauce!')
                });
            }
            // ----------FIN empecher n'importe quel utilisateur de supprimer une sauce ---------

            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error })); 
};

// --------- Récupérer une sauce ----------

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

// --------- Récuperation de l'ensembles des sauces ----------
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// --------- Les Avis donnéees aux sauces  -------
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    const idSauce = req.params.id;
    
    Sauce.findOne({ _id: idSauce })
    .then (sauce => {
        const idIncluded = !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId);
        if( like === 1 && idIncluded ) {
            Sauce.updateOne({ _id:idSauce },{
                $push: { usersLiked: req.body.userId },
                $inc: { likes: +1 }
            })
            .then(() => res.status(200).json({ message: 'like ajoutée !'}))
            .catch(error => res.status(400).json({ error }));
        }else if( like === -1 && idIncluded ) {
            Sauce.updateOne({ _id:idSauce }, {
                $push: { usersDisliked: req.body.userId },
                $inc: { dislikes: +1 }
            })
            .then(() => res.status(200).json({ message: 'dislike ajoutée !'}))
            .catch(error => res.status(400).json({ error }));
        }else {
            if(sauce.usersLiked.includes(req.body.userId)){
                Sauce.updateOne({ _id:idSauce },{
                    $pull: { usersLiked: req.body.userId },
                    $inc: { likes: -1 }
                }) 
                .then(() => res.status(200).json({ message: 'like retirée !'}))
                .catch(error => res.status(400).json({ error })); 
            }else if(sauce.usersDisliked.includes(req.body.userId)){
                Sauce.updateOne({ _id:idSauce }, {
                    $pull: { usersDisliked: req.body.userId },
                    $inc: { dislikes: -1 } 
                })
                .then(() => res.status(200).json({ message: 'dislike retirée !'}))
                .catch(error => res.status(400).json({ error }));
            }
        }
    })
};