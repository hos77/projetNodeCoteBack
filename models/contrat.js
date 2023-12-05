const mongoose = require('mongoose');

const contratSchema = mongoose.Schema({

    description : {
        type: String,
        required: true
    } ,

    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
      },
    
    
});

module.exports = mongoose.model("Contrat", contratSchema);