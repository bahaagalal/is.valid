"use strict";
const util = require('util');
// const xss = require('xss');
const checkedRules = require('./checkedRules');

const rulesWithOptions = ['minLength', 'maxLength', 'exactLength',
										 'greaterThan', 'lessThan', 'regex', 'matches',
										 'minListLength', 'maxListLength', 'beforeDate',
										 'afterDate'];

/**
	Validator class
	validation class that is heavily inspired from codeigniter
	How it works? instantiate a new object from the class passing your data array using the following format
	fieldName: fieldValue
 **/
 class Validator {

	 constructor(data) {
		 if (data)
		 		this.data = data;
		 else
		 		throw new Error('data must be set');

		 this.resetRules();

	 }

	 resetRules() {
	  this.ruledFields = {};
	 }

	 _validate(check, value, options, ruleName, fieldName) {
		 return new Promise((resolve, reject) => {
			 if (check(value, options))
			 		resolve(value);
			 else
			 		//need to resolve error value to collect all error values
			 		resolve({fieldName, error: {type: ruleName, meta: options}});
		 });
	 }

	 addRule(fieldName, rules) {
	 	this.ruledFields[fieldName] = [];

	 	let REGULAR_EXPRESSION = '#REGEX' + Math.random() + '#';
	 	let regex = rules.match(/regex\[.+\]/gi);
	 	if(regex && regex.length)	{
	 		regex = regex[0];
	 		rules = rules.replace(regex, REGULAR_EXPRESSION);
	 	}

	 	rules = rules.split('|');

	 	for (let i = 0; i < rules.length; i++) {
			if (regex) {
		 		rules[i] = rules[i].replace(REGULAR_EXPRESSION, regex);
		 	}

	 		let options = rules[i].match(/\[.+\]/gi);
	 		if (options)
	 			options = options[0].replace('[','').replace(new RegExp(']$'),'').split(',');
	 		else
	 			options = [];

	 		let ruleName = rules[i].replace(/\[.+\]/gi,'');

	 		if (checkedRules[ruleName]) {
	 			if (rulesWithOptions.indexOf(ruleName) != -1 && !options.length)
	 				throw new Error(ruleName + ' can\'t operate without options.');

	 			if (ruleName == 'matches')
	 				 	options[0] = this.data[options[0]];

	 			if (ruleName == 'regex') {
	 				try {
	 					new RegExp(options[0], 'gi');
	 				} catch(e) {
	 					throw new Error('regex expression is invalid.');
	 				}
	 			}
				//what if same rule is added twice?!
 				this.ruledFields[fieldName].push({ruleName: ruleName, options: options});
	 		}
	 		else
	 			throw new Error('rule doesn\'t exist.');
	 	}
	 }

	 run(){
		 let fieldsPromises = [];
	 	 for (let fieldName in this.ruledFields) {
	 		if (this.ruledFields[fieldName] && this.ruledFields[fieldName].length) {
	 			for (let i = 0; i < this.ruledFields[fieldName].length; i++) {
	 				let value = this.data[fieldName];
	 				let options  = this.ruledFields[fieldName][i].options;
	 				let ruleName = this.ruledFields[fieldName][i].ruleName;
	 				fieldsPromises.push(this._validate(checkedRules[ruleName], value, options, ruleName, fieldName));
	 			}
	 		}
	 	}

		return new Promise ((resolve, reject) => {
							Promise.all(fieldsPromises).then((values) => {
									let error = null;
									for (let i = 0; i < values.length; i++)
										if (values[i].error) {
											error = error || {};
											error[values[i].fieldName] = error[values[i].fieldName] || [];
											error[values[i].fieldName].push(values[i].error);
										}

									if (error)
										reject(error);
									else
										resolve(this.data);
							});
		});
	 }

 }


// /**
// 	sanitize
// 	returns the value after sanitized
//  **/
// IsValid.prototype.sanitize = function(value){
// 	if(value)
// 		return xss(value.toString().trim());
// 	return value;
// };

module.exports = Validator;
