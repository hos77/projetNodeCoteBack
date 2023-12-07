const mongoose = require('mongoose');
const voitureShema = new mongoose.Schema({
    marque: {
        type: String, 
    },
    modele: {
        type: String, 
    },

    picture: {
        type: String,
        required: true,
    },
    couleur: {
        type: String,
        required: true,
    },
    kilometrage: {
        type: String,
        required: true,
    },
    etat: {
        type: String,
        enum: ['dispo', 'epuisé'] 
    },
    prix: {
        type: String,
        required: true,
    },
    numrero_matricule : {
        type : Number , 
        required: true ,
    },

    nb_piece : {
        type : Number , 
        required: true ,
    },
    disponible: { type: Boolean, default: true },

    category:
    { type: mongoose.Schema.Types.ObjectId, ref: 'CategorieVoiture' },
    locations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
      }],
    
});

module.exports = mongoose.model("Voiture", voitureShema);