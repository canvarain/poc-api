'use strict';

/**
 * User schema definition.
 * A user represent either a staff of an organization or the end user for the billid.
 * End user means the user who has the mobile application installed and to whom the receipts are being sent.
 * A staff can also be an end user.
 *
 * @author      ritesh
 * @version     1.0
 */

var mongoose = require('../datasource').getMongoose(),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  title: { type: String, required: true, enum: [] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobileNumber: Number,
  countryCode: String,
  email: String,
  type: { type: String, required: true, enum: ['staff', 'customer', 'both'] },
  password: { type: String, required: true },
  orgId: String,
  deviceId: String
});

/**
 * Module exports
 */
module.exports = {
  UserSchema: UserSchema
};