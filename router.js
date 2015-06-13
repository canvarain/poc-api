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
var userController = require('./controllers/UserController'),
  organizationController = require('./controllers/OrganizationController'),
  receiptController = require('./controllers/ReceiptController');

module.exports = function() {
  var options = {
    caseSensitive: true
  };

  // Instantiate an isolated express Router instance
  var router = express.Router(options);
  // users
  router.post('/users', userController.create);
  router.post('/users/login', userController.login);
  router.post('/users/:id/updateDevice', auth(), userController.updateDevice);
  router.post('/users/:id/removeDevice', auth(), userController.removeDevice);
  // me
  router.get('/me/receipts', auth(), receiptController.listByUser);
  router.get('/me', auth(), userController.me);

  // receipts
  router.post('/receipts', auth(), receiptController.create);
  router.get('/receipts', auth(), receiptController.listByOrganization);
  router.get('/receipts/:id', auth(), receiptController.get);

  // organizations
  router.post('/organizations', auth(), organizationController.create);
  return router;
};