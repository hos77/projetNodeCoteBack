const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true 
    },

    description: {
        type: String,
        required: true
    },

    voitures: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voiture"
    }
});

const Categ = mongoose.model("CategorieVoiture", categorieSchema);

module.exports =  Categ ;

