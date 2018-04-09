var mongoose = require('mongoose');

var StatSchema = new mongoose.Schema({
    _id: String,
    ip: String,
    timestamp: Date
}, { _id: false });

mongoose.model('Stat', StatSchema);