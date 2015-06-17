'use strict';

/**
 * Create a cluster of node workers
 * node cluster module will automatically distribute the load among the worker processes
 * As each node process runs on a separate thread and have a event loop,
 * so ideally no of worked process should be equal to no of physical cpu cores
 * @author      ritesh
 * @version     1.0
 */

var cluster = require('cluster');

if(cluster.isMaster) {
  var cpus = require('os').cpus().length;
  for (var i = 0; i < cpus; i++) {
    cluster.fork();
  }
} else {
  // just load server.js it will automatically start the worker processes
  require('./server');
}