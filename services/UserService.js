'use strict';

/**
 * This Service exposes the contract with the 'users' collection in the database
 *
 * @author      ritesh
 * @version     1.0
 */

var UserSchema = require('../models/User').UserSchema,
  config = require('config'),
  db = require('../datasource').getDb(config.MONGODB_URL),
  User = db.model('User', UserSchema);

var async = require('async'),
  jwt = require('jwt-simple'),
  moment = require('moment'),
  httpStatus = require('http-status'),
  _ = require('lodash'),
  helper = require('./Helper'),
  bcrypt = require('bcrypt-nodejs'),
  errors = require('common-errors');

/**
 * Find a user by the given mobile number and country code
 * @param  {Number}       number              mobile number of user
 * @param  {String}       countryCode         country code
 * @param  {Function}     callback            callback function
 */
exports.getByMobileNumberAndCountryCode = function(number, countryCode, callback) {
  // It may be possible for a mobile no and coutry code more than one record exists in the system.
  // This will be the case when the no is recycled. In that case the dormat accounts has to be deleted
  // For the poc-api it is guaranteed that the mobile and country code will be unique and the user will be present
  var query = User.where({ mobileNumber: number, countryCode: countryCode });
  query.findOne(callback);
};

/**
 * Perform authentication.
 * A user can login by using mobile number of email address
 * @param  {Object}       credentials         credentials for login, must have username and password
 * @param  {Function}     callback            callback function
 */
exports.authenticate = function(credentials, callback) {
  async.waterfall([
    function(cb) {
      User.findOne({ $or:[{'email':credentials.username}, {'mobileNumber':credentials.username}]}, cb);
    },
    function(user, cb) {
      if(!user) {
        return cb(new errors.NotFoundError('User not found for given mobile number or email address'));
      }
      bcrypt.compare(credentials.password, user.password, function(err, result) {
        if(err) {
          cb(err);
        } else if(result) {
          cb(null, user);
        } else {
          cb(new errors.HttpStatusError(httpStatus.UNAUTHORIZED, 'Invalid username or password'));
        }
      });
    },
    function(user, cb) {
      var millis = moment().valueOf() + config.TOKEN_EXPIRATION_IN_MILLIS;
      var token = jwt.encode({
        expiration: millis,
        type: user.type,
        userId: user._id,
        orgId: user.orgId
      }, config.JWT_SECRET);
      cb(null, {token: token});
    }
  ], callback);
};

/**
 * Helper method to get the user by email address
 * @param  {String}       email           email of the user to find
 * @param  {Function}     callback        callback function
 */
var _findByEmail = function(email, callback) {
  var query = User.where({ email: email });
  query.findOne(callback);
};

/**
 * Create a user
 * This will persist the entity into the mongo database
 * @param  {Object}       entity          entity to create. This should be valid User schema
 * @param  {Function}     callback        callback function
 */
exports.create = function(entity, callback) {
  async.waterfall([
    function(cb) {
      _findByEmail(entity.email, function(err, user) {
        if(err) {
          cb(err);
        } else if(user) {
          cb(new errors.ValidationError('Email is already registered', httpStatus.BAD_REQUEST));
        } else {
          cb();
        }
      });
    },
    function(cb) {
      helper.generateHash(entity.password, cb);
    },
    function(hash, cb) {
      _.extend(entity, {password: hash});
      User.create(entity, cb);
    }
  ], callback);
};

/**
 * Get me.
 * Fetch the current logged in user information
 * @param  {Object}       auth            authentication context for current request
 * @param  {Function}     callback        callback function
 */
exports.me = function(auth, callback) {
  User.findById(auth.userId, callback);
};