const router = require("express").Router();
const Location = require("../models/location");
const voitures = require("../models/voiture");

//createlocation
router.post("/createlocations/:voitureId", async (req, res) => {
  try {
    const { datedebut, datefin, coutTotal, etat } = req.body;
    const voitureId = req.params.voitureId;

    const car = await voitures.findById(voitureId);
    if (!car || !car.disponible || car.nb_piece <= 0) {
      return res.status(400).json({ error: "Car not available for location" });
    }

    // Subtract 1 from nb_piece
    car.nb_piece -= 1;

    await car.save();

    // Create the location
    const location = new Location({
     datedebut,
      datefin,
      coutTotal,
      etat,
      voiture: voitureId,
    });
    const savedLocation = await location.save();
    car.locations.push(savedLocation._id);
    await car.save();
    res.json(savedLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//update a location
router.put("/locations/:locationId", async (req, res) => {
  try {
    const locationId = req.params.locationId;
    const updatedLocation = req.body;

    const location = await Location.findByIdAndUpdate(
      locationId,
      updatedLocation,
      { new: true }
    );

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//deletealocation
// router.delete("/deletelocations/:locationId", async (req, res) => {
//   try {
//     const locationId = req.params.locationId;

//     const location = await Location.findById(locationId);
//     if (!location) {
//       return res.status(404).json({ error: "Location not found" });
//     }

//     // Mark the associated car as available
//     const car = await voitures.findById(location.voiture);
//     if (car) {
//         car.nb_piece += 1;
//         car.locations.pull(location._id); // Remove the location's _id from the 'locations' array
//         await car.save();
//     }
//     await location.re
//     res.json({ message: "Location deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
router.delete("/deletelocations/:locationId", async (req, res) => {
    try {
      const locationId = req.params.locationId;
      const location = await Location.findById(locationId);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
  
      // Mark the associated car as available
      const car = await voitures.findById(location.voiture);
      if (car) {
          car.nb_piece += 1;
          car.locations.pull(location._id); // Remove the location's _id from the 'locations' array
          await car.save();
      }
  
      // Delete the location by its ID
      await Location.findByIdAndDelete(locationId);
      res.json({ message: "Location deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


//getAllLocation
router.get("/locations", async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//getLocationBycar
router.get("/getLocationbyCar/:voitureId", async (req, res) => {
  try {
    const voitureId = req.params.voitureId;
    const locations = await Location.find({ voiture: voitureId });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
