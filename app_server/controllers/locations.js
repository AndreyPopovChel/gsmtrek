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
    title: 'АРМ Пчеловода Система ТЕССО',
    pageHeader: {
      title: 'АРМ Пчеловода Система ТЕССО',
      strapline: ''
    },
    sidebar: "",
    locations: filteredLocations,
    message: message
  });
};

var renderCards = function(req, res, responseBody){
  var message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "No places found nearby";
    }
  }

  var mainLocations = [];
  var otherLocations = [];

  responseBody.forEach(function (doc) {
    if (parseInt(doc.sn) <= 100000) {
      mainLocations.push(doc);
    }
    else
    {
      doc.color = 'blue';
      otherLocations.push(doc);
    }
  });

  var colorIndex = 0;
  for(var i = 0; i < mainLocations.length; i++)
  {
     if(colorIndex % 3 === 0)
     {
       mainLocations[i].color = 'white';
     }
     else if(colorIndex % 3 === 1)
     {
       mainLocations[i].color = 'blue';
     }
     else if(colorIndex % 3 === 2)
     {
       mainLocations[i].color = 'yellow';
     }

     colorIndex++;

     if(i == 5 || (i % 6 === 5))
     {
       colorIndex++;
     }
  }

  var colorIndex = 0;
  for(var i = 0; i < otherLocations.length; i++)
  {
    if(colorIndex % 3 === 0)
    {
      otherLocations[i].color = 'white';
    }
    else if(colorIndex % 3 === 1)
    {
      otherLocations[i].color = 'blue';
    }
    else if(colorIndex % 3 === 2)
    {
      otherLocations[i].color = 'yellow';
    }

    colorIndex++;

    if(i == 5 || (i % 6 === 5))
    {
      colorIndex++;
    }
  }

  res.render('bee-family', {
    title: 'АРМ Пчеловода Система ТЕССО',
    pageHeader: {
      title: 'АРМ Пчеловода Система ТЕССО',
      strapline: ''
    },
    sidebar: "",
    locations: mainLocations,
    otherLocations: otherLocations,
    message: message
  });
};

/* GET 'home' page */
module.exports.cards = function(req, res){
  var requestOptions, path;
  path = '/api/lastLocations';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
      requestOptions,
      function(err, response, body) {
        renderCards(req, res, body);
      }
  );
};

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

/* GET 'customize' page */
module.exports.customize = function(req, res){
  res.render('customization-form', {
    title: 'Настройка ответа',
    pageHeader: { title: 'Настройка ответа' },
    error: req.query.err
  });
};

module.exports.doCustomize = function(req, res){
  var requestOptions, path, postdata;
  path = "/api/customize";
  postdata = {
    sn: req.body.sn,
    cfgLock: req.body.cfgLock,
    updateTimeMin: req.body.updateTimeMin,
    smsEnable: req.body.smsEnable,
    phoneNumber: req.body.phoneNumber,
    paramsmsEnable: req.body.paramsmsEnable
  };
  requestOptions = {
    url : apiOptions.server + path,
    method : "POST",
    json : postdata
  };
  if (!postdata.sn) {
    res.redirect('/customize');
  } else {
    request(
        requestOptions,
        function(err, response, body) {
          res.redirect('/customize');
        }
    );
  }
};

module.exports.settings = function(req, res){
  var requestOptions, path;
  path = '/api/customize';
  if(req.query['sn'])
  {
    path += '?sn=' + req.query['sn'];
  }
  request({
    method: 'GET',
    url: apiOptions.server + path
  }, function (error, response, body) {
    res.status(200).send(body);
  });
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

