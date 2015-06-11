'use strict';

var errors = require('common-errors');

/**
 * Authentication middleware
 * This middleware will parse the auth header and decode the information in the auth header
 * and make it available on the req.auth property of the request object.
 * This middleware should only be added for secure ENDPOINTS
 *
 * @author      ritesh
 * @version     1.0
 */

var jwt = require('jwt-simple'),
  moment = require('moment'),
  jwt = require('jwt-simple'),
  config = require('config');

var authorizationTypes = {
  bearer: 'Bearer'
};

var middleware = function(req, res, next) {
  var authorizationHeader = req.get('Authorization');
  // authenticaiton logic
  if(authorizationHeader) {
    var splitted = authorizationHeader.split(' ');
    if(splitted.length !== 2 || splitted[0] !== authorizationTypes.bearer) {
      return next(new errors.AuthenticationRequiredError('Invalid authorization header'));
    }
    var token = splitted[1];
    req.auth = jwt.decode(token, config.JWT_SECRET);
    if(req.auth.expiration > moment().valueOf()) {
      return next();
    }
    next(new errors.AuthenticationRequiredError('Authorization token is expired'));
  } else {
    next(new errors.AuthenticationRequiredError('Missing authorization header'));
  }
};

module.exports = function() {
  return middleware;
};