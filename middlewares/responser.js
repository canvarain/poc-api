'use strict';

/**
 * Response middleware.
 * This middleware will parse the response data fromt the req object and commit the response to client.
 * The response data will be associated in 'req.data' property in req object
 *
 * 1. If statusCode is present 'req.data.statusCode' will be send to client otherwise 200 HTTP_OK will be send
 * 2. If content is present 'req.data.content' will be send to client otherwise 204 HTTP NO CONTENT status code will only be send
 *
 * @author      ritesh
 * @version     1.0
 */
var httpStatus = require('http-status');

var middleware = function(req, res, next) {
  if(req.data && req.data.content) {
    res.status(req.data.statusCode || httpStatus.OK).json(req.data.content);
  } else {
    res.status((req.data && req.data.statusCode) ? req.data.statusCode : httpStatus.NO_CONTENT);
  }
}

module.exports = function() {
  return middleware;
}