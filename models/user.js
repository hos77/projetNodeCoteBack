const mongoose = require('mongoose');
const userShema = new mongoose.Schema({
    cin: {
        type: String,
    },
    nom: {
        type: String,
    },
    prenom: {
        type: String,
    },
    adresse: {
        type: String,
    },
    phone: {
        type: String,
    },
    
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
      },
   
});
module.exports = mongoose.model("User", userShema);