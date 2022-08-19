var mongoose = require('mongoose');

autoIncrement.initialize(mongoose.connection);

var locationSchema = new mongoose.Schema({
    sn: String,
    ctr: String,
    batt: String,
    date: String,
    time: String,
    lat: String,
    lon: String,
    gpsvis: String,
    gnsvis: String,
    satused: String,
    gsmlc: String,
    gsmlat: String,
    gsmlon: String,
    gsmdate: String,
    gsmtime: String,
    humidity: String,
    temperature1: String,
    pressurebarom: String,
    temperature2: String,
    TVOC: String,
    CO2eq: String,
    acoustic: String,
    timestamp: Date
});

var Counter = mongoose.model('Counter', locationSchema);

mongoose.model('Location', locationSchema);
