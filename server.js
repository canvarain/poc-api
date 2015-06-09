'use strict';

/**
 * Main application init file.
 * This will spin up an HTTP SERVER which will listen on connections on default configured port
 * @author      ritesh
 * @version     1.0
 */

var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  router = require('./router'),
  errorHandler = require('./middlewares/ErrorHandler'),
  responser = require('./middlewares/responser'),
  config = require('config');

var port = process.env.PORT || config.WEB_SERVER_PORT || 3100;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(router());
app.use(responser());
app.use(errorHandler());
app.listen(port);
console.log('Application listening on port ' + port);