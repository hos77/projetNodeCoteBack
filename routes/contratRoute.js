const router = require('express').Router();
const Contrat = require('../models/contrat');
const Location = require('../models/location')
const authMiddleware = require('../middlewares/auth');

// router.post('/contrats/:locationId', async (req, res) => {
//     try {
//       const {description  } = req.body;
//       const locationId = req.params.locationId;
  
//       const location = await Location.findById(locationId);
//       if (!location) {
//         return res.status(404).json({ error: 'Location not found' });
//       }
  
//       // Create the Contrat
//       const contrat = new Contrat({ description, location: locationId });
//       const savedContrat = await contrat.save();
  
//       // Associate the Contrat with the Location
//       location.contrat = savedContrat._id;
//       await location.save();


//       res.json(savedContrat);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });



  router.post('/contrats/:locationId', authMiddleware, async (req, res) => {
    try {
      const { description } = req.body;
      const locationId = req.params.locationId;
  
      // Additional check if the authenticated user has the right to create a Contrat for this location
      const location = await Location.findById(locationId);
      if (!location || location.user.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
  
      // Create the Contrat
      const contrat = new Contrat({ description :description, location: locationId , user: req.user.userId });
      const savedContrat = await contrat.save();
  
      // Associate the Contrat with the Location
      location.contrat = savedContrat._id;
      await location.save();
      res.json(savedContrat);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get('/contratsbylocation/:locationId', authMiddleware, async (req, res) => {
    try {
      const locationId = req.params.locationId;

      // Additional check if the authenticated user has the right to access Contrats for this location
      const location = await Location.findById(locationId);
      if (!location || location.user.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      // Find Contrat associated with the specified Location
      const contrat = await Contrat.findOne({ location: locationId });
      if (!contrat) {
        return res.status(404).json({ error: 'Contrat not found for this location' });
      }
  
      res.json(contrat);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



  
  








module.exports = router;