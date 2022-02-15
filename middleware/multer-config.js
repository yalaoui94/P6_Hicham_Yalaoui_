//----- Implémenter des téléchargements de fichiers -----
const multer = require('multer');

// Dictionnaire //
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//------ configuration de multer -------
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); // crée un nom au fichier 
        const extension = MIME_TYPES[file.mimetype];        // créer l'extention 
        callback(null, name + Date.now() + '.' + extension); // crée le file name complet 
    }
});

module.exports = multer({ storage }).single('image');