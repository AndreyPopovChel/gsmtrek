var mongoose = require('mongoose');

var CustomizationSchema = new mongoose.Schema({
    _id: String,
    sn: String,
    cfgLock: String,
    updateTimeMin: String,
    smsEnable: String,
    phoneNumber: String,
    paramsmsEnable: String,
    deviceType: Number,
    numberInOrder: Number
}, { _id: false });

mongoose.model('Customization', CustomizationSchema);