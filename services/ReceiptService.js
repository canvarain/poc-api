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
  userTypes = require('./Helper').userTypes,
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

/**
 * Create a receipt.
 * The following operations are performed
 * 1. Authorize the user who is creating the receipt
 * 2. Publish the entity body to receiptNotification queue
 * 3. Publish the entity body to receiptPersist queue
 * The consumers will take the message from each queue and then process it.
 * Response to the client will be returned immediately after publishing to the queues
 *
 * @param  {Object}       entity            entity from client to create
 * @param  {[type]}       auth              authentication context for the current request
 * @param  {Function}     callback          callback function
 */
exports.create = function(entity, auth, callback) {
  var message = {
    auth: auth,
    entity: entity
  };
  async.waterfall([
    function(cb) {
      if(!auth.orgId || auth.type === userTypes.customer) {
        cb(new errors.NotPermittedError('User is not allowed to perform this operation'));
      } else {
        cb();
      }
    },
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
  Receipt.find({ orgId: auth.orgId }, callback);
};

/**
 * List all the receipts for the current loggedin user
 * @param  {Object}       auth            authentication context for the current request
 * @param  {Function}     callback        callback function
 */
exports.listByUser = function(auth, callback) {
  Receipt.find({userId: auth.userId}, callback);
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