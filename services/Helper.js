'use strict';

/**
 * Utility helper class.
 * @author      ritesh
 * @version     1.0
 */

var bcrypt = require('bcrypt-nodejs'),
  _ = require('lodash'),
  async = require('async'),
  config = require('config');

exports.userTypes = {
  staff: 'staff',
  customer: 'customer',
  both: 'both'
};

/**
 * Generate a hash of the given plainText string
 *
 * @param  {String}       plainText        plainText string
 * @param  {Function}     callback         callback function
 */
exports.generateHash = function(plainText, callback) {
  async.waterfall([
    function(cb) {
      bcrypt.genSalt(config.SALT_WORK_FACTOR, cb);
    },
    function(salt, cb) {
      bcrypt.hash(plainText, salt, null, cb);
    }
  ], callback);
};

/**
 * Filter the given mongoose schema instance to valid javascript object.
 * This will remove the unwanted properties
 * @param  {Object}       obj              object to filter
 */
exports.filterObject = function(obj) {
  var transformed;
  if(obj.toObject) {
    transformed = obj.toObject();
  } else {
    transformed = obj;
  }
  if(obj._id) {
    transformed.id = obj._id;
  }
  return _.omit(transformed, '_id', '__v', 'password');
};