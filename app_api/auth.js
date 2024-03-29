const { expressjwt } = require('express-jwt');

function getTokenFromHeader(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

var auth = {
  required: expressjwt({
    secret: process.env.SECRET, 
    algorithms: ['RS256'],    
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: expressjwt({
    secret: process.env.SECRET, 
    algorithms: ['RS256'],
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
};

module.exports = auth;
