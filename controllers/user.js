// importation bcrypt pour le hash du mot de passe
const bcrypt = require('bcrypt');

//importation du package jsonwebtoken qui va nous créer un token et de le vérifier // 
const jwt = require('jsonwebtoken');


// importation du models
const User = require('../models/user');

// signup pour accéder en tant que nouvel utilisateur
exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User ({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({message: 'utilisateur créé !' }))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// login pour accéder en tant qu'utilisateur existant
exports.login = (req, res, next) => {

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user){
                return res.status(401).json({ error: 'utilisateur non trouvé !' });
            }
            
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.RANDOM_SECRET_KEY,
                            { expiresIn: '1h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};