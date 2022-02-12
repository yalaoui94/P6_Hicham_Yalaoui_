const mongoose = require('mongoose');

const modelsSauce = mongoose.Schema({
  name: { type: String, require: true },
  manufacturer: { type: String, require: true },
  description: { type: String, require: true },
  imageUrl: { type: String, require: true },
  mainPepper: { type: String, require: true },
  userId: { type: String, require: true },
  heat: { type: Number, require: true },
  likes: { type: Number, require: true, default: 0 },
  dislikes: { type: Number, require: true, default: 0 },
  usersLiked: { type: [String], require: true, default: [] },
  usersDisliked: { type: [String], require: true, default: [] },

});

module.exports = mongoose.model('Sauce', modelsSauce);