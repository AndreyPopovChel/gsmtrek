var mongoose = require('mongoose');
var Customization = mongoose.model('Customization');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* POST a new customization (settings for response)*/
/* /api/locations/customizations */
module.exports.customizationsCreate = function(req, res) {
  var newValue = {
    _id: req.body.sn,
    sn: req.body.sn,
    cfgLock: req.body.cfgLock,
    updateTimeMin: req.body.updateTimeMin,
    smsEnable: req.body.smsEnable,
    phoneNumber: req.body.phoneNumber,
    paramsmsEnable: req.body.paramsmsEnable,
    deviceType: req.body.deviceType,
    numberInOrder: req.body.numberInOrder,
    hideDevice: req.body.hideDevice,
    ownerUserName: req.body.ownerUserName
  };

  var propNames = Object.getOwnPropertyNames(newValue);
  for (var i = 0; i < propNames.length; i++) {
    var propName = propNames[i];
    if (newValue[propName] === null || newValue[propName] === undefined || newValue[propName] === "") {
      delete newValue[propName];
    }
  }

  if(!newValue.hideDevice)
  {
    newValue.hideDevice = false;
  }

  Customization.findOneAndUpdate({'sn':req.body.sn}, newValue, {upsert:true}, function(err, customization){
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(customization);
      res.sendStatus(200);
    }
  });
};

module.exports.customizationFind = function(req, res) {

  Customization.find({_id: req.query.sn},function(err, customizations){
    var defaultResult = {
      "sn": req.query.sn,
      "ctr": "1",
      "cfgLock": "1",
      "updateTimeMin": "240",
      "smsEnable": "0",
      "phoneNumber": "+7XXXXXXXXXX",
      "paramsmsEnable": "1110000000011111100000",
      "deviceType": 0 // Улей
    };

    if (err) {
      console.log(err);
      res.status(200).json(defaultResult);
    } else {
      if(customizations.length > 0)
      {
        var result = {
          "sn": customizations[0].sn,
          "ctr": customizations[0].ctr,
          "cfgLock": customizations[0].cfgLock,
          "updateTimeMin": customizations[0].updateTimeMin,
          "smsEnable": customizations[0].smsEnable,
          "phoneNumber": customizations[0].phoneNumber,
          "paramsmsEnable": customizations[0].paramsmsEnable
        };       
        res.status(200).json(result);
      }
      else
      {
        res.status(200).json(defaultResult);
      }
    }
  });
};

module.exports.customizationsByOwner = function(req, res) {

  if(req.query.username)
  {
    Customization.find({ownerUserName: req.query.username},function(err, customizations){
      var defaultResult = [];
      if (err) {
        console.log(err);
        res.status(200).json(defaultResult);
      } else {           
          res.status(200).json(customizations);      
      }
    });
  }
  else
  {
    Customization.find({},function(err, customizations){
      var defaultResult = [];
      if (err) {
        console.log(err);
        res.status(200).json(defaultResult);
      } else {           
          res.status(200).json(customizations);      
      }
    });
  }  
};