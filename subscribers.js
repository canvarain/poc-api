/* jshint unused: false */
'use strict';

/**
 * subscribers.js
 * Registers all subscribers for all the queues
 *
 * @author      ritesh
 * @version     1.0
 */

var winston = require('winston'),
  gcm = require('node-gcm'),
  async = require('async');
var queues = require('./queues'),
  queueNames = queues.names;

var receiptService = require('./services/ReceiptService'),
  config = require('config'),
  userService = require('./services/UserService');

var googleApiKey = config.util.getEnv(config.GOOGLE_API_KEY_VARIABLE_NAME);
var sender = new gcm.Sender(googleApiKey);

/**
 * Listener for any messages on receiptnotification queue.
 * This method will send the push notification to the customer device
 * @param   {Object}      message         message that is published
 */
var _receiptNotificationHandler = function(message) {
};

/**
 * Helper method to send the notification to the user
 * @param   {Object}      user            user to send the notification to
 * @param   {Object}      receipt         receipt to send
 * @param   {Function}    callback        callback function
 */
var _sendNotification = function(user, receipt, callback) {
  var message = new gcm.message();
  message.addData({
    title: 'Transaction Receipt',
    body: 'Your transaction receipt for amount ' + receipt.amount,
    icon: 'billid-notification-icon.png',
    sound: 'billidnotification.wav',
    data: {
      receiptId: receipt._id
    }
  });
  sender.send(message, user.deviceId, config.MAX_SEND_RETRY_COUNT, callback);
};

/**
 * Listener for any messages on receiptpersist queue.
 * This method will persist the data into the mongodb collection
 * @param   {Object}      message         message that is published
 */
var _receiptPersistHandler = function(message) {
  var authInfo = message.auth;
  var entity = message.entity;
  entity.orgId = authInfo.orgId;
  // receipts can only be created by the authorized staff of the organization
  // so the loggedin userId is the staffId who generated the receipt
  entity.staffId = authInfo.userId;
  async.waterfall([
    function(cb) {
      userService.getByMobileNumberAndCountryCode(entity.mobileNumber, entity.countryCode, cb);
    },
    function(user, cb) {
      // delete the mobile number and country code from the entity
      delete entity.mobileNumber;
      delete entity.countryCode;
      entity.userId = user._id;
      receiptService.persist(entity, function(err, savedReceipt) {
        cb(err, user, savedReceipt);
      });
    },
    function(user, receipt, cb) {
      _sendNotification(user, receipt, cb);
    }
  ], function(err, savedReceipt) {
    // if error occured, do something try to save again ( republish in the queue )
    if(err) {
      winston.error('Error while persisting/sending notification [' + JSON.stringify(err) + ']', err);
    }
  });
};

/**
 * Registers all the subscribers for all the queues.
 * These subscribers will listen for messages that are published on the queue and do some operation
 */
exports.registerAll = function() {
  queues.subscribe(queueNames.receiptNotification, _receiptNotificationHandler);
  queues.subscribe(queueNames.receiptPersist, _receiptPersistHandler);
};