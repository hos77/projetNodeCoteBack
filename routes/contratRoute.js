const router = require('express').Router();
const Contrat = require('../models/contrat');
const location = require('../models/location')

router.post('/contrats/:locationId', async (req, res) => {
    try {
      const {description  } = req.body;
      const locationId = req.params.locationId;
  
      const location = await Location.findById(locationId);
      if (!location) {
        return res.status(404).json({ error: 'Location not found' });
      }
  
      // Create the Contrat
      const contrat = new Contrat({ description, location: locationId });
      const savedContrat = await contrat.save();
  
      // Associate the Contrat with the Location
      location.contrat = savedContrat._id;
      await location.save();


      res.json(savedContrat);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



  
  








module.exports = router;