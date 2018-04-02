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
    paramsmsEnable: req.body.paramsmsEnable
  };

  var propNames = Object.getOwnPropertyNames(newValue);
  for (var i = 0; i < propNames.length; i++) {
    var propName = propNames[i];
    if (newValue[propName] === null || newValue[propName] === undefined || newValue[propName] === "") {
      delete newValue[propName];
    }
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
      "paramsmsEnable": "1110000000011111100000"
    };

    if (err) {
      console.log(err);
      res.status(200).json(defaultResult);
    } else {
      if(customizations.length > 0)
      {
        res.status(200).json(customizations[0]);
      }
      else
      {
        res.status(200).json(defaultResult);
      }
    }
  });
};