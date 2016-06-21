"use strict";
const moment = require('moment');
const checkedRules = {
	required: (value) => Boolean(value && value.toString().length > 0),
	matches: (value, options) => Boolean(value == options[0]),
	minLength: (value, options) => Boolean(value.length >= options[0]),
	maxLength: (value, options) => Boolean(value.length <= options[0]),
	exactLength: (value, options) => Boolean(value.length == options[0]),
	greaterThan: (value, options) => Boolean(parseInt(value) > parseInt(options[0])),
	lessThan: (value, options) => Boolean(parseInt(value) < parseInt(options[0])),
	regex: (value, options) => {
		var regularExpression = new RegExp(options.shift(), 'gi');
		return Boolean(value.match(regularExpression));
	},
	alpha: (value) => Boolean(value.match(/^[a-z]+$/gi)),
	alphaNumeric: (value) => Boolean(value.match(/^[a-z0-9]+$/gi)),
	alphaNumericDash: (value) => Boolean(value.match(/^[a-z0-9\-]+$/gi)),
	numeric: (value) => Boolean(value.match(/^[0-9]+$/gi)),
	integer: (value) => Boolean(value.match(/^[\-\+]?[0-9]+$/gi)),
	decimal: (value) => Boolean(value.match(/^[\-\+]?[0-9]+(\.[0-9]+)?$/gi)),
	natural: (value) => Boolean(value.match(/^[\+]?[0-9]+?$/gi)),
	naturalNoZero: (value) => Boolean(value.match(/^[\+]?[0-9]+?$/gi) && parseInt(value) > 0),
	email: (value) => Boolean(value.match(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/gi)),
	list: (value) => {
		var list = value.split(',');
		for(var i = 0; i < list.length; i++) {
			if(!list[i] || !list[i].trim())
				return Boolean(false);
		}
		return Boolean(true);
	},
    minListLength: (value, options) => Boolean(value.split(',').filter(value => value.trim()).length >= options[0]),
    maxListLength: (value, options) => Boolean(value.split(',').filter(value => value.trim()).length <= options[0]),
	date: (value) => {
			var date = moment(new Date(value)).format('X'); //format should be passed in options!!
			return Boolean((date == 'Invalid date') ? false : true);
	},
	beforeDate: (value, options) => {
		var date = moment(new Date(value)).format('X');
		var before = moment(new Date(options[0])).format('X');
		return Boolean(date < before);
	},
	afterDate: (value, options) => {
		var date = moment(new Date(value)).format('X');
		var after = moment(new Date(options[0])).format('X');
		return Boolean(date > after);
	},
	boolean: (value) => Boolean(value === 'true' || value === 'false')
};

module.exports = checkedRules;
