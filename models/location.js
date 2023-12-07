const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  datedebut: {
    type: Date,
  },

  datefin: {
    type: Date,
  },

  coutTotal: {
    type: Number,
    required: true,
  },

  etat: {
    type: String,

    enum: ["en cours", "terminé"],

    require: true,
  },

  voiture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voiture",
    required: true,
  },
  contrat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contrat", 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require:true , 
  },





});

module.exports = mongoose.model("Location", locationSchema);
