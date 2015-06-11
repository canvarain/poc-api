'use strict';

/**
 * Router logic, this class will implement all the API routes login
 * i.e, mapping the routes to controller and add auth middleware if any route is secure.
 *
 * @author      ritesh
 * @version     1.0
 */

var express = require('express');
var auth = require('./middlewares/Auth');
var UserController = require('./controllers/UserController'),
  ReceiptController = require('./controllers/ReceiptController');

module.exports = function() {
  var options = {
    caseSensitive: true
  };

  // Instantiate an isolated express Router instance
  var router = express.Router(options);
  // users
  router.post('/users', UserController.create);
  router.post('/users/login', UserController.login);
  // me
  router.get('/me/receipts', auth(), ReceiptController.listByUser);
  router.get('/me', auth(), UserController.me);

  // receipts
  router.post('/receipts', auth(), ReceiptController.create);
  router.get('/receipts', auth(), ReceiptController.listByOrganization);
  router.get('/receipts/:id', auth(), ReceiptController.get);
  return router;
};