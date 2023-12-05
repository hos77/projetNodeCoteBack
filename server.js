const express = require('express');
const session = require('express-session'); 
require('./config/connexion');
const app = express();
const PORT =  8000;
// Middleweres
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false,
    })
);
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

app.use(express.static('Upload'));

// Route prefix
app.use("", require('./routes/routes'));
app.use("/user", require('./routes/userRoute'));
app.use("/productCateg", require('./routes/categorieVoitureRoute'));
app.use("/locationCar", require('./routes/locationRoute'));
app.use("/contratlocation", require('./routes/contratRoute'));
app.listen(PORT, () =>{
    console.log(`server started at http://localhost:${PORT}`);
})