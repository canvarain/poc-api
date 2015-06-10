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
  router.post('/receipts', ReceiptController.create);
  return router;
}