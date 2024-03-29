'use strict';

/**
 * User controller
 * This controller honour the REST API contract for '/users' EXNPOINT
 *
 * @author      ritesh
 * @version     1.0
 */

var userService = require('../services/UserService'),
  httpStatus = require('http-status'),
  controllerHelper = require('./ControllerHelper'),
  async = require('async');

/**
 * Validate the given entity to be a valid user schema data
 * @param  {Object}     entity          entity to validate
 * @param  {Function}   callback        entity to validate
 */
var _validateUser = function(entity, callback) {
  callback(null, entity);
};

/**
 * Route handler for POST '/users' endpoint
 * @param  {Object}     req       Express request instance
 * @param  {Object}     res       Express response instance
 * @param  {Function}   next      next function to call next middleware in chain
 */
exports.create = function(req, res, next) {
  async.waterfall([
    function(cb) {
      _validateUser(req.body, cb);
    },
    function(entity, cb) {
      userService.create(entity, cb);
    }
  ], function(err) {
    if(err) {
      return next(err);
    }
    req.data = {
      statusCode: httpStatus.CREATED
    };
    next();
  });
};

/**
 * Route handler for POST '/users/login' endpoint
 * @param  {Object}     req       Express request instance
 * @param  {Object}     res       Express response instance
 * @param  {Function}   next      next function to call next middleware in chain
 */
exports.login = function(req, res, next) {
  userService.authenticate(req.body, function(err, token) {
    if(err) {
      return next(err);
    }
    req.data = {
      statusCode: httpStatus.OK,
      content: token
    };
    next();
  });
};

/**
 * Route handler for GET '/me' endpoint
 * @param  {Object}     req       Express request instance
 * @param  {Object}     res       Express response instance
 * @param  {Function}   next      next function to call next middleware in chain
 */
exports.me = function(req, res, next) {
  userService.me(req.auth, function(err, user) {
    if(err) {
      return next(err);
    }
    req.data = {
      statusCode: httpStatus.OK,
      content: user
    };
    next();
  });
};

/**
 * Route handler for POST '/users/:id/updateDevice' endpoint
 * @param  {Object}     req       Express request instance
 * @param  {Object}     res       Express response instance
 * @param  {Function}   next      next function to call next middleware in chain
 */
exports.updateDevice = function(req, res, next) {
  var entity = req.body;
  var error = controllerHelper.checkDefined(entity, 'Entity') || controllerHelper.checkString(entity.deviceId, 'Device id');
  if(error) {
    return next(error);
  }
  userService.updateDevice(req.params.id, req.auth, entity, function(err) {
    if(err) {
      return next(err);
    }
    req.data = {
      statusCode: httpStatus.OK
    };
    next();
  });
};

/**
 * Route handler for POST '/users/:id/removeDevice' endpoint
 * @param  {Object}     req       Express request instance
 * @param  {Object}     res       Express response instance
 * @param  {Function}   next      next function to call next middleware in chain
 */
exports.removeDevice = function(req, res, next) {
  var entity = req.body;
  var error = controllerHelper.checkDefined(entity, 'Entity') || controllerHelper.checkString(entity.deviceId, 'Device id');
  if(error) {
    return next(error);
  }
  userService.removeDevice(req.params.id, req.auth, entity, function(err) {
    if(err) {
      return next(err);
    }
    req.data = {
      statusCode: httpStatus.OK
    };
    next();
  });
};