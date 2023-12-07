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
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require:true , 
      },
    
    
});

module.exports = mongoose.model("Contrat", contratSchema);