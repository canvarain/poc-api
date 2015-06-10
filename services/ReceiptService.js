'use strict';

var ReceiptSchema = require('../models/Receipt').ReceiptSchema,
  config = require('config'),
  db = require('../datasource').getDb(config.MONGODB_URL),
  Receipt = db.model('Receipt', ReceiptSchema);

var queues = require('./queues'),
  queueNames = queues.names;

var async = require('async');

/**
 * This Service exposes the contract with the 'receipts' collection in the database
 *
 * @author      ritesh
 * @version     1.0
 */

/**
 * Persist the given entity into the database
 * Before persist the entity has to be validated for correct data schema as defined in Receipt Schema
 * @param  {Object}       entity            entity to presist
 * @param  {Function}     callback          callback function
 */
exports.persist = function(entity, callback) {
  Receipt.create(entity, callback);
};

exports.create = function(entity, callback) {
  async.waterfall([
    function(cb) {
      queues.publish(queueNames.receiptNotification, entity, function() {
        cb();
      });
    },
    function(cb) {
      queues.publish(queueNames.receiptPersist, entity, function() {
        cb();
      });
    }
  ], callback);
};

/**
 * List all the receipts for the given organization identified by the authentication context
 * @param  {Object}       auth            authentication context for the current request
 * @param  {Function}     callback        callback function
 */
exports.listByOrganization = function(auth, callback) {

};

/**
 * List all the receipts for the current loggedin user
 * @param  {Object}       auth            authentication context for the current request
 * @param  {Function}     callback        callback function
 */
exports.listByUser = function(auth, callback) {

};