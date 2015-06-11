'use strict';

/**
 * This Service exposes the contract with the 'organizations' collection in the database
 *
 * @author      ritesh
 * @version     1.0
 */

var OrganizationSchema = require('../models/Organization').OrganizationSchema,
  config = require('config'),
  db = require('../datasource').getDb(config.MONGODB_URL),
  Organization = db.model('Organization', OrganizationSchema);

/**
 * Create a organization.
 * The data will be persisted into the mongo DB before sending the response to client
 * @param  {Object}       entity            entity from client to create
 * @param  {[type]}       auth              authentication context for the current request
 * @param  {Function}     callback          callback function
 */
exports.create = function(entity, auth, callback) {
  Organization.create(entity, callback);
};