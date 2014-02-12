var xss = require('xss');

/**
	isValid class
	validation class that is heavily inspired from codeigniter
	How it works? instantiate a new object from the class passing your data array using the following format
	fieldName: fieldValue
 **/
var IsValid = function(data, errorMessages){
	this.data = data;

	this.errorMessages = errorMessages || require('./errorMessages');
};

/**
	required
	validates that value is not undefined, null, NaN, empty string or digit zero
 **/
IsValid.prototype.required = function(value, options, callback){
	callback(Boolean(value && value.toString().length > 0), options);
};

/**
	minLength
	options[0] == min length
	validates that value.length is greater than or equal to min length
 **/
IsValid.prototype.minLength = function(value, options, callback){
	callback(Boolean(value.length >= options[0]), options);
};

/**
	maxLength
	options[0] == max length
	validates that value.length is less than or equal to max length
 **/
IsValid.prototype.maxLength = function(value, options, callback){
	callback(Boolean(value.length <= options[0]), options);
};

/**
	exactLength
	options[0] == exact length
	validates that value.length is equal to exact length
 **/
IsValid.prototype.exactLength = function(value, options, callback){
	callback(Boolean(value.length == options[0]), options);
};

/**
	greaterThan
	options[0] == camprable
	validates that value is greater than comparable
 **/
IsValid.prototype.greaterThan = function(value, options, callback){
	callback(Boolean(parseInt(value) > parseInt(options[0])), options);
};

/**
	lessThan
	options[0] == camprable
	validates that value is less than comparable
 **/
IsValid.prototype.lessThan = function(value, options, callback){
	callback(Boolean(parseInt(value) < parseInt(options[0])), options);
};

/**
	alpha
	validates that value contains only alphabet characters
 **/
IsValid.prototype.alpha = function(value, options, callback){
	callback(Boolean(value.match(/^[a-z]+$/gi)), options);
};

/**
	alphaNumeric
	validates that value contains only alphabet and/or numbers characters
 **/
IsValid.prototype.alphaNumeric = function(value, options, callback){
	callback(Boolean(value.match(/^[a-z0-9]+$/gi)), options);
};

/**
	alphaNumericDash
	validates that value contains only alphabet, numbers and/or dash characters
 **/
IsValid.prototype.alphaNumericDash = function(value, options, callback){
	callback(Boolean(value.match(/^[a-z0-9\-]+$/gi)), options);
};

/**
	numeric
	validates that value contains only numbers
 **/
IsValid.prototype.numeric = function(value, options, callback){
	callback(Boolean(value.match(/^[0-9]+$/gi)), options);
};

/**
	integer
	validates that value is integer
 **/
IsValid.prototype.integer = function(value, options, callback){
	callback(Boolean(value.match(/^[\-\+]?[0-9]+$/gi)), options);
};

/**
	decimal
	validates that value is decimal number
 **/
IsValid.prototype.decimal = function(value, options, callback){
	callback(Boolean(value.match(/^[\-\+]?[0-9]+(\.[0-9]+)?$/gi)), options);
};

/**
	natural
	validates that value is natural number
 **/
IsValid.prototype.natural = function(value, options, callback){
	callback(Boolean(value.match(/^[\+]?[0-9]+?$/gi)), options);
};

/**
	naturalNoZero
	validates that value is a natural number and not zero
 **/
IsValid.prototype.naturalNoZero = function(value, options, callback){
	callback(Boolean(value.match(/^[\+]?[0-9]+?$/gi) && parseInt(value) > 0), options);
};

/**
	email
	validates that value looks like an email
 **/
IsValid.prototype.email = function(value, options, callback){
	callback(Boolean(value.match(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/gi)), options);
};

/**
	regex
	options[0] == comparable pattern
	validates that value matches a given pattern
 **/
IsValid.prototype.regex = function(value, options, callback){
	var regularExpression = new RegExp(options.shift(), 'gi');
	callback(Boolean(value.match(regularExpression)), options);
};

/**
	matches
	options[0] == comparable value
	validates that value matches a given value
 **/
IsValid.prototype.matches = function(value, options, callback){
	callback(Boolean(value == options[0]), options);
};

/**
	sanitize
	returns the value after sanitized
 **/
IsValid.prototype.sanitize = function(value){
	return xss(value.trim());
};

module.exports = IsValid;