const express = require("express");
const router = express.Router();
const User = require("../models/user");
// const multer = require('multer');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* fileName = '';
//----------------------------------------(Upload image)------------------------------------------------

 const strg = multer.diskStorage({
    destination: './Upload',
    filename: (req, file, redirect) => {

        let date = Date.now();
        let fl = date + '.' + file.mimetype.split('/')[1];

        redirect(null, fl);
        fileName = fl;
    }
})  */

/* var strg = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './Upload');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
}); */

// const upload = multer({storage: strg});
// , upload.any('image')    signup

// -------------------------------------------(GET ALL USER)----------------------------------------------

router.get("/users", async (req, res) => {
  try {
    users = await User.find();
    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

// -------------------------------------------(GET USER)----------------------------------------------

router.get("/getUserById/:id", async (req, res) => {
  try {
    myid = req.params.id;
    user = await User.findById(myid);

    res.send(user);
  } catch (error) {
    res.send(err);
  }
});

// -------------------------------------------(SIGN UP)----------------------------------------------

router.post("/signUp", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    // Save the user to the database
    const savedUser = await newUser.save();
    // Create and sign a JSON Web Token (JWT)
    const token = jwt.sign(
      {
        userId: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
      },
      "my secret key",
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, savedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user with the provided email exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username  or password" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Create and sign a JSON Web Token (JWT)
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
      },
      "my secret key",
      { expiresIn: "1h" }
    );
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});








// -------------------------------------------(LOGIN)----------------------------------------------
// router.post( '/logIn' , async (req, res) => {

//     data = req.body;
//     user = await User.findOne({ email: data.email});

//     if (!user){
//         res.status(404).send(' Email or Password invalid !');
//     }
//     else {
//         validPass = bcrypt.compareSync( data.password , user.password);

//         if (!validPass) {
//             res.status(401).send(' Email or Password invalid ! ');
//         }
//         else {
//             payload = {
//                 _id: user._id,
//                 cin: user.cin,
//                 nom: user.nom,
//                 prenom: user.prenom,
//                 adresse: user.adresse,
//                 phone: user.phone,
//                 email: user.email
//             }
//             token = jwt.sign( payload , '1234567');
//             res.status(200).send({ mytoken : token});
//         }
//     }
// });

// -------------------------------------------(DELETE USER(Methode 2))----------------------------------------------

router.delete("/deleteUser/:id", async (req, res) => {
  try {
    myid = req.params.id;
    await User.deleteOne({ _id: myid });
    res.send("User deleted Successfully !");
  } catch (error) {
    res.send(err);
  }
});

// -------------------------------------------(UPDATE USER(Methode 1))----------------------------------------------

/* router.put( '/updateUser/:id' , (req, res) =>{

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
});  */

router.put("/updateUser/:id", async (req, res) => {
  const myid = req.params.id;
  const newUser = req.body;

  try {
    const userUpdated = await User.findByIdAndUpdate({ _id: myid }, newUser, {
      new: true,
    });

    if (newUser.password) {
      const salt = bcrypt.genSaltSync(10);
      const cryptedPass = bcrypt.hashSync(newUser.password, salt);

      userUpdated.password = cryptedPass;

      await userUpdated.save();
    }

    res.send(userUpdated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
