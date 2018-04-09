var mongoose = require('mongoose');
var moment = require('moment');
var autoIncrement = require('mongoose-auto-increment');

var Loc = mongoose.model('Location');
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
                    console.log('locations error:', err);
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
            { $sort: { 'number': -1 } },
            { $group: {
                _id: '$sn',
                sn: { $first: '$sn' },
                date: { $first: '$date' },
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
                console.log('locations error:', err);
                sendJSONresponse(res, 404, err);
            } else {
                locations = buildLocationList(req, res, result, true);
                sendJSONresponse(res, 200, locations);
            }
        }
    );
};

var buildLocationList = function (req, res, results, sortBySn) {
    var locations = [];
    results.forEach(function (doc) {
      if(doc.sn) {
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
              number: doc.number
          });
      }
    });

    if(sortBySn)
    {
        locations.sort(function (a, b) {
                var left = 0;
                if (a.sn) {
                    left = parseInt(a.sn);
                }
                var right = 0;
                if (b.sn) {
                    right = parseInt(b.sn);
                }
                return (left < right) ? -1 : ((right < left) ? 1 : 0);
            }
        );
    }
    else {
        locations.sort(function (a, b) {
                var left = 0;
                if (a.number) {
                    left = parseInt(a.number);
                }
                var right = 0;
                if (b.number) {
                    right = parseInt(b.number);
                }
                return (left < right) ? 1 : ((right < left) ? -1 : 0);
            }
        );
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

