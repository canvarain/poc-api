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
var winston = require('winston');

var middleware = function(err, req, res, next) {
  winston.error('Error while processing request [' + JSON.stringify(err) + ']');
  res.status(err.code || httpStatus.INTERNAL_SERVER_ERROR).json(err);
};

module.exports = function() {
  return middleware;
}