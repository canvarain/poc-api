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
  winston = require('winston'),
  cors = require('cors'),
  errorHandler = require('./middlewares/ErrorHandler'),
  responser = require('./middlewares/Responser'),
  responseTransformer = require('./middlewares/ResponseTransformer'),
  config = require('config');

var queues = require('./queues'),
  subscribers = require('./subscribers');

var port = process.env.PORT || config.WEB_SERVER_PORT || 3100;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(router());
app.use(responseTransformer());
app.use(responser());
app.use(errorHandler());
// initialize the pub/sub queues
queues.init(function() {
  subscribers.registerAll();
  app.listen(port);
  winston.info('Application listening on port ' + port)
});