const express = require('express'); // importation d'express
const router = express.Router(); // importation du rooter
const userCtrl = require('../controllers/user'); // importation du userCrtl

const password = require('../middleware/password') // importation du password


router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;