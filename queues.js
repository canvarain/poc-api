'use strict';

/**
 * Exposes all the queues in the application
 * 1. receiptpersist
 *    receiptpersist queue will persist the receipt into a persistance storage. The persistant storage can be anything
 *    currently it is mongo database. This queue guarantees that the receipt will be persisted.
 * 2. receiptnotification
 *    receiptnotification queue will send the email, sms or push notification to the user.
 *    This queue guarantees that the notifications must be delivered to the user
 *
 * @author      ritesh
 * @version     1.0
 */

var amqp = require('amqp'),
  async = require('async'),
  errors = require('common-errors'),
  config = require('config');

var names = exports.names = {
  receiptNotification: 'receiptnotification',
  receiptPersist: 'receiptpersist'
};

var queues = {};

var connection;

/**
 * Get the initialzed connection. If the connection is not initialized it will initialize the connection
 * @param  {Function}     callback          callback function will be called with connection instance as second argument
 */
var _getConnection = function(callback) {
  if(!connection) {
    _initConnection(function() {
      callback(null, connection);
    });
  } else {
    callback(null, connection);
  }
};

/**
 * Initialize the connection to RabbitMQ instance
 * @param  {Function}     callback          callback function
 */
var _initConnection = function(callback) {
  connection = amqp.createConnection({ host: config.RABBITMQ_URL });
  connection.on('ready', callback);
}

/**
 * Initialize. This method will initialize the following
 * 1. connection to the RabbitMQ server
 * 2. Create all the queues and store them in an object for further reference
 * @param  {Function}     callback          callback function
 */
exports.init = function(callback) {
  async.waterfall([
    function(cb) {
      _initConnection(function() {
        _getConnection(cb);
      });
    },
    function(conn, cb) {
      conn.queue(names.receiptNotification, function(que) {
        que.bind('#');
        queues[names.receiptNotification] = que;
        cb(null, conn);
      });
    },
    function(conn, cb) {
      conn.queue(names.receiptPersist, function(que) {
        que.bind('#');
        queues[names.receiptPersist];
        cb();
      });
    }
  ], callback);
};

/**
 * Publish a message to a queue identified by queueName.
 * If the queueName is not valid then callback will be called with error.
 * @param  {String}       queueName         name of the queue to which publish the messages
 * @param  {Object}       body              message body
 * @param  {Function}     callback          callback function
 */
exports.publish = function(queueName, body, callback) {
  if(!names[queueName]) {
    return callback(new errors.ArgumentError('queueName'));
  }
  _getConnection(function(err, conn) {
    if(err) {
      return callback(err);
    }
    conn.publish(queueName, body, callback);
  });
};

/**
 * Subscribe for all the messages on the queue identified by the given queueName
 * Whenever a message is published on the queue it will invoke the registered callback function
 * @param  {String}       queueName         name of the queue to subscribe to
 * @param  {Function}     callback          callback function
 */
exports.subscribe = function(queueName, callback) {
  if(!names[queueName]) {
    return callback(new errors.ArgumentError('queueName'));
  }
  var que = queues[queueName];
  que.subscribe(callback);
};

