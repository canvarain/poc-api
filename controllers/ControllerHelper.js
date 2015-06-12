'use strict';

/**
 * Helper utility class for all the controllers
 * This class exports some common validation functions as well as filtering functions
 * @author      ritesh
 * @version     1.0
 */

/* Globals */
var _ = require('lodash'),
  errors = require('common-errors');

var HTTP_BAD_REQUEST = 400;

/**
 * Validate that given value is a valid String
 *
 * @param  {String}           val      String to validate
 * @param  {String}           name     name of the string property
 * @return {Error/Undefined}           Error if val is not a valid String otherwise undefined
 */
exports.checkString = function(val, name) {
  if(!_.isString(val)) {
    return new errors.ValidationError(name + ' should be a valid string', HTTP_BAD_REQUEST);
  }
};

/**
 * Validate that given value is a valid Date
 *
 * @param  {Date/String}           val      Date to validate
 * @param  {String}                name     name of the Date property
 * @return {Error/Undefined}                Error if val is not a valid String otherwise undefined
 */
exports.checkDate = function(val, name) {
  // string representation of date
  if(_.isString(val)) {
    var date = new Date(val);
    if(!_.isDate(date)) {
      return new errors.ValidationError(name + ' should be a valid String representation of Date', HTTP_BAD_REQUEST);
    }
  } else {
    if(!_.isDate(val)) {
      return new errors.ValidationError(name + ' should be a valid Date', HTTP_BAD_REQUEST);
    }
  }
};

/**
 * Validate that given value is a valid positive number
 *
 * @param  {Number}                val      Number to validate
 * @param  {String}                name     name of the Date property
 * @return {Error/Undefined}                Error if val is not a valid String otherwise undefined
 */
exports.checkPositiveNumber = function(val, name) {
  val = parseInt(val);
  if(!_.isNumber(val) || isNaN(val)) {
    return new errors.ValidationError(name + ' should be a valid number', HTTP_BAD_REQUEST);
  } else if(val < 0) {
    return new errors.ValidationError(name + ' should be a valid positive number', HTTP_BAD_REQUEST);
  }
};

/**
 * Validate that given obj is defined
 *
 * @param  {Object}                val      Object to validate
 * @param  {String}                name     name of the Date property
 * @return {Error/Undefined}                Error if val is not a valid String otherwise undefined
 */
exports.checkDefined = function(obj, name) {
  if(_.isUndefined(obj)) {
    return new errors.ValidationError(name + ' should be defined', HTTP_BAD_REQUEST);
  }
};