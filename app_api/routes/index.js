var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');

router.get('/locations', ctrlLocations.locationsList);
router.post('/locations', ctrlLocations.locationsCreate);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);

module.exports = router;
