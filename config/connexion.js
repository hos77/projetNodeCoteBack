const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/locationVoiture')
    .then(
        () => {
            console.log('Connected To DataABase');
        } 
    )
    .catch(
        (err) => {
            console.log(err);
        } 
    )

module.exports = mongoose;    