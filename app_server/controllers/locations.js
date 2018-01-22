var request = require('request');
var apiOptions = {
  server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://gsmtrek.herokuapp.com";
}


var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry.";
  } else if (status === 500) {
    title = "500, internal server error";
    content = "How embarrassing. There's a problem with our server.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};

var renderHomepage = function(req, res, responseBody){
  var message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "No places found nearby";
    }
  }

  var filteredLocations = responseBody;

  if(req.query['sn']) {
    function filterBySn(obj) {
      if ('sn' in obj && obj.sn === req.query['sn']) {
        return true;
      } else {
        return false;
      }
    }

    filteredLocations = filteredLocations.filter(filterBySn);
  }

  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'GSM tracking',
      strapline: ''
    },
    sidebar: "",
    locations: filteredLocations,
    message: message
  });
};

/* GET 'home' page */
module.exports.homelist = function(req, res){
  var requestOptions, path;
  path = '/api/locations';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      renderHomepage(req, res, body);
    }
  );
};

module.exports.settings = function(req, res){
  var result = {
    "sn": req.query.sn,
    "ctr": "1",
    "cfgLock": "1",
    "updateTimeMin": "240",
    "smsEnable": "0",
    "phoneNumber": "+7XXXXXXXXXX",
    "paramsmsEnable": "1110000000011111100000"
  };
  res.status(200).json(result);
};

module.exports.postLocation = function(req, res){
  var requestOptions, path;
  path = '/api/locations';

  request({
    method: 'POST',
    url: apiOptions.server + path,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  }, function (error, response, body) {
    res.status(200).json(response);
  });

};

var getLocationInfo = function (req, res, callback) {
  var requestOptions, path;
  path = "/api/locations/" + req.params.locationid;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      if (response.statusCode === 200) {

        callback(req, res, body);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

