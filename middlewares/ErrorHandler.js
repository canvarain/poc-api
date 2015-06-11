/* jshint unused: false */
'use strict';

/**
 * Global error handler middleware.
 * Any function which takes four arguments instead of 3 is an error handler middleware.
 * This middleware is added in the last in middleware chain so that all the errors in API
 * is handled by this middleware
 *
 * 1. If error object has status code than that status code will be send to client otherwise 'INTERNAL SERVER ERROR' will be send
 * 2. Error object can be a object, array.
 *
 * @author      ritesh
 * @version     1.0
 */

var httpStatus = require('http-status');
var errors = require('common-errors');
var winston = require('winston');
var DEFAULT_NAME = 'ServerError',
  DEFAULT_MESSAGE = 'Internal server error';

var middleware = function(err, req, res, next) {
  winston.error('Error while processing request [' + JSON.stringify(err) + ']', err);
  if(err instanceof Error) {
    var httpError = new errors.HttpStatusError(err);
    if(err.status_code >= 500) {
      httpError.message = DEFAULT_MESSAGE;
    }
    res.status(httpError.status_code).json({ message: httpError.message, name: err.name || DEFAULT_NAME });
  } else {
    res.status(err.code || httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || DEFAULT_MESSAGE, name: err.name || DEFAULT_NAME });
  }
};

module.exports = function() {
  return middleware;
};