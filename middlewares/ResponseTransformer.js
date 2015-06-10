'use strict';

/**
 * Response transformer middleware
 * This middleware is added before sending the response to the client.
 * This will transform the response in following way
 * 1. Delete the __v property
 * 2. Delete _id property and instead expose it on id property
 *
 * @author      ritesh
 * @version     1.0
 */

var middleware = function(req, res, next) {
  if(req.data && req.data.content) {
    if(req.content._id) {
      req.content.id = req.content._id;
      delete req.content._id;
    }
    if(req.content.__v) {
      delete req.content.__v;
    }
    next();
  } else {
    next();
  }
}

module.exports = function() {
  return middleware;
}