var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locationsCtrl');
var ctrlCustomization = require('../controllers/customizationCtrl');
var ctrlUsers = require('../controllers/usersCtrl');
var auth = require('../auth');

router.get('/locations', ctrlLocations.locationsList);
router.get('/lastLocations', ctrlLocations.lastLocationsList);
router.post('/locations', ctrlLocations.locationsCreate);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);

router.post('/customize', ctrlCustomization.customizationsCreate);
router.get('/customize', ctrlCustomization.customizationFind);
router.get('/serialnumbers', ctrlCustomization.customizationsByOwner);

router.get('/user', auth.optional, ctrlUsers.getUser);
router.put('/user', auth.optional, ctrlUsers.putUser);
router.post('/users/login', auth.optional, ctrlUsers.login);
router.post('/users', auth.optional, ctrlUsers.postUser);

module.exports = router;
