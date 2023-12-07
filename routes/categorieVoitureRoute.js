const express = require('express');
const router = require('express').Router();
const  CategorieVoiture = require('../models/categorieVoiture');
const Voiture = require('../models/voiture');
const Location = require('../models/location');
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');
fileName = '';
var strg = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './Upload');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "" + Date.now() + "" + file.originalname);
    },
}); 

const upload = multer({storage: strg});




// Get all the  categories
router.get('/categories', authMiddleware ,  async (req, res) => {
    try {
        const categories = await CategorieVoiture.find().populate('voitures');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific category by ID
router.get('/categories/:id', authMiddleware ,  async (req, res) => {
    try {
        const category = await CategorieVoiture.findById(req.params.id).populate('voitures');
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Update a category by ID
router.patch('/categories/:id', authMiddleware , async (req, res) => {
    try {
        const updatedCategory = await CategorieVoiture.findByIdAndUpdate(
            req.params.id,
            {
                nom: req.body.nom,
                description: req.body.description,
            },
            { new: true }
        ).populate('voitures');

        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Delete a category by ID
router.delete('/categories/:id', authMiddleware ,  async (req, res) => {
    try {
        const deletedCategory = await CategorieVoiture.findByIdAndDelete(req.params.id);
        res.json(deletedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new category
router.post('/create_categories'  , authMiddleware  , async (req, res) => {

    const category = new CategorieVoiture({
        nom: req.body.nom,
        description: req.body.description,
        photo : req.body.photo
    });

    try {
        const newCategory = await category.save();
        fileName = '';
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// router.get('/voitures/category/:categorieId', async (req, res) => {
//     try {
//       const voitures = await Voiture.find({ categorie: req.params.categorieId });
//       res.json(voitures);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });


// Get all cars
router.get('/voitures', authMiddleware ,  async (req, res) => {
    try {
        const voitures = await Voiture.find();
        res.json(voitures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/voitures/:voitureId', authMiddleware ,  async (req, res) => {
    try {
      const voitureId = req.params.voitureId;
      const voiture = await Voiture.findById(voitureId).populate('category').populate({
        path: 'locations',
        populate: {
          path: 'voiture',
          model: 'Voiture',
        },
      });
  
      if (!voiture) {
        return res.status(404).json({ error: 'Car not found' });
      }
  
      res.json(voiture);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


//getAllcarbycategorie
router.get('/getallcarbycategory/:categorieId' , authMiddleware ,  async(req , res) =>{

    try {
        const voitures = await Voiture.find({category : req.params.categorieId});
        res.json(voitures);
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }


});

//crete a car 
router.post('/voitures/:categorieId', authMiddleware , async (req, res) => {
    
    const categorie = await CategorieVoiture.findById(req.params.categorieId);
    const voiture = new Voiture({
        marque: req.body.marque,
        modele: req.body.modele,
        picture : req.body.picture ,
        couleur: req.body.couleur,
        kilometrage: req.body.kilometrage,
        etat: req.body.etat,
        prix: req.body.prix,
        numrero_matricule: req.body.numrero_matricule,
        nb_piece: req.body.nb_piece,
        category : categorie ,
    });

    try {
        const newVoiture = await voiture.save();
        res.status(201).json(newVoiture);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



// Update a car by ID
// router.patch('/voitures/:id', async (req, res) => {
//     try {
//         const updatedVoiture = await Voiture.findByIdAndUpdate(
//             req.params.id,
//             {
//                 marque: req.body.marque,
//                 modele: req.body.modele,
//                 couleur: req.body.couleur,
//                 kilometrage: req.body.kilometrage,
//                 etat: req.body.etat,
//                 prix: req.body.prix,
//             },
//             { new: true }
//         );

//         res.json(updatedVoiture);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// Delete a car by ID
// router.delete('/voitures/:id', async (req, res) => {
//     try {
//         const deletedVoiture = await Voiture.findByIdAndDelete(req.params.id);
//         res.json(deletedVoiture);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });



// Update a car
router.put('/updatevoitures/:voitureId', async (req, res) => {
    try {
      const { marque, modele, couleur ,kilometrage  ,etat ,prix ,numrero_matricule , nb_piece,  categorieId } = req.body;
      const categorie = await CategorieVoiture.findById(categorieId);
  
      if (!categorie) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
  
      const voiture = await Voiture.findByIdAndUpdate(req.params.voitureId, { marque, modele,couleur, kilometrage ,etat ,prix ,numrero_matricule, nb_piece
          , categorie : categorie._id }, { new: true });
  
      if (!voiture) {
        res.status(404).json({ error: 'Car not found' });
        return
      }
  
      res.json(voiture);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Delete a car
  router.delete('/voitures/:voitureId', async (req, res) => {
    try {
      const voiture = await Voiture.findByIdAndDelete(req.params.voitureId);
  
      if (!voiture) {
        res.status(404).json({ error: 'Car not found' });
        return;
      }
  
      // Remove the car from the category
      const categorie = await CategorieVoiture.findById(voiture.category);
      if (categorie) {
        categorie.voitures.pull(voiture._id);
        await categorie.save();
      }
  
      res.json({ message: 'Car deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
