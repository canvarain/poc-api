'use strict';

/**
 * Organization controller
 * This controller honour the REST API contract for '/organizations' EXNPOINT
 *
 * @author      ritesh
 * @version     1.0
 */

var organizationService = require('../services/OrganizationService'),
  async = require('async'),
  httpStatus = require('http-status');

/**
 * Validate the given entity to be a valid organization schema data
 * @param  {Object}     entity          entity to validate
 * @param  {Function}   callback        entity to validate
 */
var _validateOrganization = function(entity, callback) {
  callback(null, entity);
};

/**
 * Route handler for POST '/organizations' endpoint
 * @param  {Object}     req       Express request instance
 * @param  {Object}     res       Express response instance
 * @param  {Function}   next      next function to call next middleware in chain
 */
exports.create = function(req, res, next) {
  async.waterfall([
    function(cb) {
      _validateOrganization(req.body, cb);
    },
    function(entity, cb) {
      organizationService.create(entity, req.auth, cb);
    }
  ], function(err, content) {
    if(err) {
      return next(err);
    }
    req.data = {
      statusCode: httpStatus.CREATED,
      content: content
    };
    next();
  });
};