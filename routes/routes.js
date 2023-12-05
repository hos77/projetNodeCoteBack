const express = require('express');
const router = express.Router();
const User = require('../models/user');

// -------------------------------------------(GET ALL USER(Methode 1))---------------------------------------------- 
router.get( '/getUsers' , (req, res) => {
    
    User.find()
    .then(
        (users) => {
            res.send(users);
        }
    )
    .catch(
        (err) => {
            res.send(err);
        }
    )
});


// -------------------------------------------(GET USER ById(Methode 1))---------------------------------------------- 

router.get( '/getUser/:id' , (req, res) => {

    myid = req.params.id;

    User.findOne({_id: myid})
    .then(
        (user) => {
            res.send(user);
        }
    )
    .catch(
        (err) => {
            res.send(err);
        }
    )
});



// -------------------------------------------(ADD USER(Methode 1))---------------------------------------------- 

router.post( '/add' , (req, res) => {
    
    data = req.body;
    
    user = new User(data);

    user.save()
    .then(
        (savedUser) => {
            res.send(savedUser);
        }
    )
    .catch(
        (err) => {
            res.send(err);
        }
    )
});



// -------------------------------------------(UPDATE USER(Methode 1))---------------------------------------------- 

router.put( '/update/:id' , (req, res) =>{

    myid = req.params.id;
    newUser = req.body;

    User.findByIdAndUpdate({ _id: myid} , newUser)
    .then(
        (userUpdated) => {
            res.send(userUpdated);
        }
    )
    .catch(
        (err) => {
            res.send(err);
        }
    )
}); 

// -------------------------------------------(UPDATE USER(Methode 1))---------------------------------------------- 

router.put( '/updateById' , () =>{
    console.log('update work !');
}); 

// -------------------------------------------(DELETE USER(Methode 1))---------------------------------------------- 

router.delete( '/deleteById/:id' , (req, res) => {

    myid = req.params.id;

    User.findByIdAndDelete({ _id: myid })
    .then(

        () => {
            res.send('User deleted Successfully !');
        }
    )
    .catch(
        (err) => {
            res.send(err);
        }
    )
});


module.exports = router;