const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String } // Ajout du champ pour la photo de profil
});

module.exports = mongoose.model('User', userSchema);
