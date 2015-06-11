'use strict';

/**
 * This Service exposes the contract with the 'receipts' collection in the database
 *
 * @author      ritesh
 * @version     1.0
 */

var ReceiptSchema = require('../models/Receipt').ReceiptSchema,
  config = require('config'),
  errors = require('common-errors'),
  db = require('../datasource').getDb(config.MONGODB_URL),
  Receipt = db.model('Receipt', ReceiptSchema);

var queues = require('../queues'),
  queueNames = queues.names;

var async = require('async');

/**
 * Persist the given entity into the database
 * Before persist the entity has to be validated for correct data schema as defined in Receipt Schema
 * @param  {Object}       entity            entity to presist
 * @param  {Function}     callback          callback function
 */
exports.persist = function(entity, callback) {
  Receipt.create(entity, callback);
};

exports.create = function(entity, auth, callback) {
  var message = {
    auth: auth,
    entity: entity
  };
  async.waterfall([
    function(cb) {
      queues.publish(queueNames.receiptNotification, message, cb);
    },
    function(cb) {
      queues.publish(queueNames.receiptPersist, message, cb);
    }
  ], callback);
};

/**
 * List all the receipts for the given organization identified by the authentication context
 * @param  {Object}       auth            authentication context for the current request
 * @param  {Function}     callback        callback function
 */
exports.listByOrganization = function(auth, callback) {
  var query = Receipt.where({ orgId: auth.orgId });
  query.find(callback);
};

/**
 * List all the receipts for the current loggedin user
 * @param  {Object}       auth            authentication context for the current request
 * @param  {Function}     callback        callback function
 */
exports.listByUser = function(auth, callback) {
  var query = Receipt.where({ userId: auth.userId });
  query.find(callback);
};

/**
 * Get a receipt by id
 * @param  {String}       id              id of the receipt to get
 * @param  {Function}     callback        callback function
 */
exports.findById = function(id, callback) {
  Receipt.findById(id, function(err, receipt) {
    if(err) {
      callback(err);
    } else if(!receipt) {
      callback(new errors.NotFoundError('Receipt not found for given id'));
    } else {
      callback(null, receipt);
    }
  });
};