var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');

/* Locations pages */
router.get('/', ctrlLocations.homelist);
router.get('/data', ctrlLocations.settings);
router.post('/data', ctrlLocations.postLocation);

module.exports = router;
