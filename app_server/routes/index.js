var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');

/* Locations pages */
router.get('/', ctrlLocations.homelist);
router.post('/', ctrlLocations.postLocation);
//router.get('/location/:locationid', ctrlLocations.locationInfo);

module.exports = router;
