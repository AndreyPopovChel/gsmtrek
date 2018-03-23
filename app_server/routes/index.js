var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');

/* Locations pages */
router.get('/', ctrlLocations.cards);
router.get('/datalog', ctrlLocations.homelist);
router.get('/customize', ctrlLocations.customize);
router.post('/customize', ctrlLocations.doCustomize);
router.get('/data', ctrlLocations.settings);
router.post('/data', ctrlLocations.postLocation);

module.exports = router;
