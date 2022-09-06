var mongoose = require('mongoose');
var moment = require('moment');

var Loc = mongoose.model('Location');
var Customization = mongoose.model('Customization');
var Stat = mongoose.model('Stat');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

/* GET list of locations */
module.exports.locationsList = function (req, res) {
    //update statistic
    var ip_addr = req.connection.remoteAddress;

    var newValue = {
        _id: ip_addr,
        ip: ip_addr,
        timestamp: new Date()
    };

    Stat.findOneAndUpdate({'ip':ip_addr}, newValue, {upsert:true}, function(err, st){
        if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
        } else {
            Loc.find(function (err, results, stats) {
                var locations;
                if (err) {
                    console.log('32 locations error:', err);
                    sendJSONresponse(res, 404, err);
                } else {
                    locations = buildLocationList(req, res, results, stats);
                    sendJSONresponse(res, 200, locations);
                }
            });
        }
    });
};

module.exports.lastLocationsList = function (req, res) {
    Loc.aggregate(
        [
            { $sort: { 'timestamp': -1 } },
            { $group: {
                _id: '$sn',
                sn: { $first: '$sn' },
                date: { $first: '$date' },
                batt: { $first: '$batt' },
                number: { $first: '$number' },
                temperature1: { $first: '$temperature1' },
                humidity: { $first: '$humidity' },
                temperature2: { $first: '$temperature2' },
                CO2eq: { $first: '$CO2eq' },
                TVOC: { $first: '$TVOC' },
                pressurebarom: { $first: '$pressurebarom' },
                gsmlat: { $first: '$gsmlat' },
                gsmlon: { $first: '$gsmlon' },
                timestamp: { $first: '$timestamp' }
            }}
        ],
        function(err,result) {
            var locations;
            if (err) {
                console.log('66 locations error:', err);
                sendJSONresponse(res, 404, err);
            } else {

                Customization.find({}, function(err1, customizations) {
                    var dict = {};
                    for (i = 0; i < customizations.length; i++) {
                        dict[customizations[i].sn] = customizations[i];
                    }

                    locations = buildLocationList(req, res, result, true, dict);

                    sendJSONresponse(res, 200, locations);
                });
            }
        }
    );
};

var buildLocationList = function (req, res, results, sortBySn, dict) {
    var locations = [];

        results.forEach(function (doc) {
          if(doc.sn) {
              var deviceType = 1; // Улей
              var numberInOrder = parseInt(doc.sn);
              var label = 'Улей';
              var hideDevice = false;

              var skipByOwner = false;
              if(req.query.username)
              {
                skipByOwner = true;
              }

              if (dict && dict[doc.sn] ) {

                  if(req.query.username === dict[doc.sn].ownerUserName)
                  {
                    skipByOwner = false;
                  }

                  if(dict[doc.sn].deviceType)
                  {
                      deviceType = dict[doc.sn].deviceType;
                  }
                  if(dict[doc.sn].numberInOrder)
                  {
                      numberInOrder = dict[doc.sn].numberInOrder;
                  }

                  if(dict[doc.sn].hideDevice &&dict[doc.sn].hideDevice == true )
                  {
                      hideDevice = true;
                  }

                  if(deviceType == 2)
                  {
                      label = 'Омшаник';
                  }
                  if(deviceType == 3)
                  {
                      label = 'Жилой вагон';
                  }
                  if(deviceType == 4)
                  {
                      label = 'Рабочий вагон';
                  }
                  if(deviceType == 5)
                  {
                      label = 'Пасека улица';
                  }
                  if(deviceType == 6)
                  {
                      label = 'Резерв 1';
                  }
                  if(deviceType == 7)
                  {
                      label = 'Резерв 2';
                  }
              }

              if(!skipByOwner)
              {
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
                    acoustic: doc.acoustic,
                    timestamp: doc.timestamp ? moment(doc.timestamp).format('DD.MM.YYYY H:mm:ss') : '-',
                    number: doc.number,
                    deviceType: deviceType,
                    numberInOrder: numberInOrder,
                    label: label,
                    hideDevice: hideDevice
                });
              }
          }
      });


    if(sortBySn)
    {
        locations.sort(function (a, b) {
                var left = 0;

                if(a.deviceType && b.deviceType && a.deviceType != b.deviceType)
                {
                    if(a.deviceType == 1)
                    {
                        return 1;
                    }

                    if(b.deviceType == 1)
                    {
                        return -1;
                    }
                }

                if (a.numberInOrder) {
                    left = a.numberInOrder;
                }
                var right = 0;
                if (b.numberInOrder) {
                    right = b.numberInOrder;
                }
                return (left < right) ? -1 : ((right < left) ? 1 : 0);
            }
        );
    }
    else {
        locations.sort(function (a, b) {
                var left = 0;
                if (a.timestamp) {
                    left = moment(a.timestamp);
                }
                var right = 0;
                if (b.timestamp) {
                    right = moment(b.timestamp);
                }
                return (left < right) ? -1 : ((right < left) ? 1 : 0);
            }
        );

        locations = locations.slice(0, 500);
    }

     return locations;
};

/* GET a location by the id */
module.exports.locationsReadOne = function (req, res) {
    console.log('Finding location details', req.params);
    if (req.params && req.params.locationid) {
        Loc
            .findById(req.params.locationid)
            .exec(function (err, location) {
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
module.exports.locationsCreate = function (req, res) {
    console.log("req: "  + JSON.stringify(req.body));
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
        acoustic: req.body.acoustic,
        timestamp: new Date()

    }, function (err, location) {
        if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
        } else {
            console.log(location);
            res.sendStatus(200);
        }
    });
};

