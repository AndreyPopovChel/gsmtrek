var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* GET list of locations */
module.exports.locationsList = function(req, res) {

  Loc.find( function(err, results, stats) {
    var locations;
    if (err) {
      console.log('locations error:', err);
      sendJSONresponse(res, 404, err);
    } else {
      locations = buildLocationList(req, res, results, stats);
      sendJSONresponse(res, 200, locations);
    }
  });
};

var buildLocationList = function(req, res, results) {
  var locations = [];
  results.forEach(function(doc) {
    locations.push({
      sn: doc.sn,
      ctr: doc.ctr,
      batt: doc.batt,
      date: doc.date,
      time: doc.time,
      lat: doc.lat,
      lon: doc.lon,
      gpsvis: doc.gpsvis,
      gnsvis: doc.gnsvis,
      satused: doc.satused,
      gsmlc: doc.gsmlc,
      gsmlat: doc.gsmlat,
      gsmlon: doc.gsmlon,
      gsmdate: doc.gsmdate,
      gsmtime: doc.gsmtime,
      humidity: doc.humidity,
      "temperature 1": doc.temperature1,
      pressurebarom: doc.pressurebarom,
      "temperature 2": doc.temperature2,
      TVOC: doc.TVOC,
      CO2eq: doc.CO2eq,
      acoustic: doc.acoustic

    });
  });
  return locations;
};

/* GET a location by the id */
module.exports.locationsReadOne = function(req, res) {
  console.log('Finding location details', req.params);
  if (req.params && req.params.locationid) {
    Loc
      .findById(req.params.locationid)
      .exec(function(err, location) {
        if (!location) {
          sendJSONresponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(location);
        sendJSONresponse(res, 200, location);
      });
  } else {
    console.log('No locationid specified');
    sendJSONresponse(res, 404, {
      "message": "No locationid in request"
    });
  }
};

/* POST a new location */
/* /api/locations */
module.exports.locationsCreate = function(req, res) {
  console.log(req.body);
  Loc.create({
    sn: req.body.sn,
    ctr: req.body.ctr,
    batt: req.body.batt,
    date: req.body.date,
    time: req.body.time,
    lat: req.body.lat,
    lon: req.body.lon,
    gpsvis: req.body.gpsvis,
    gnsvis: req.body.gnsvis,
    satused: req.body.satused,
    gsmlc: req.body.gsmlc,
    gsmlat: req.body.gsmlat,
    gsmlon: req.body.gsmlon,
    gsmdate: req.body.gsmdate,
    gsmtime: req.body.gsmtime,
    humidity: req.body.humidity,
    temperature1: req.body["temperature 1"],
    pressurebarom: req.body.pressurebarom,
    temperature2: req.body["temperature 2"],
    TVOC: req.body.TVOC,
    CO2eq: req.body.CO2eq,
    acoustic: req.body.acoustic

  }, function(err, location) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(location);
      var result = {
        "sn":location.sn,
        "ctr":"1",
        "cfgLock":"1",
        "updateTimeMin":"240",
        "smsEnable":"0",
        "phoneNumber":"+7XXXXXXXXXX",
        "paramsmsEnable": "1110000000011111100000"
      };
      sendJSONresponse(res, 201, result);
    }
  });
};

