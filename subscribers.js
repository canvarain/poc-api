'use strict';

/**
 * subscribers.js
 * Registers all subscribers for all the queues
 *
 * @author      ritesh
 * @version     1.0
 */

var queues = require('./queues'),
  queueNames = queues.names;

/**
 * Listener for any messages on receiptnotification queue.
 * This method will send the push notification to the customer device
 */
var _receiptNotificationHandler = function() {
  console.log('receipt notification subscribe');
};

/**
 * Listener for any messages on receiptpersist queue.
 * This method will persist the data into the mongodb collection
 */
var _receiptPersistHandler = function() {
  console.log('receipt persist subscribe');
};

/**
 * Registers all the subscribers for all the queues.
 * These subscribers will listen for messages that are published on the queue and do some operation
 */
exports.registerAll = function() {
  queues.subscribe(queueNames.receiptNotification, _receiptNotificationHandler);
  queues.subscribe(queueNames.receiptPersist, _receiptPersistHandler);
};