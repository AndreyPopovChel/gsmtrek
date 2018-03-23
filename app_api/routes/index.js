var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlCustomization = require('../controllers/customization');

router.get('/locations', ctrlLocations.locationsList);
router.get('/lastLocations', ctrlLocations.lastLocationsList);
router.post('/locations', ctrlLocations.locationsCreate);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);

router.post('/customize', ctrlCustomization.customizationsCreate);
router.get('/customize', ctrlCustomization.customizationFind);

module.exports = router;
