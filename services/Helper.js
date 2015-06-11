'use strict';

/**
 * Utility helper class.
 * @author      ritesh
 * @version     1.0
 */

var bcrypt = require('bcrypt-nodejs'),
  async = require('async'),
  config = require('config');

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