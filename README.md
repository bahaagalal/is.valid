# is.valid

[![Build Status](https://travis-ci.org/bahaagalal/is.valid.png?branch=master)](https://travis-ci.org/bahaagalal/is.valid)

Validation library for node.js inspired from the old famous codeigniter validation library.

## How to use

Install from npm

```bash
npm install is.valid
```

Instantiate a new is.valid object

```js
var IsValid = require('is.valid');

/** construct a new is.valid object passing the data array to validate
  * date array should contain a set of objects formatted as following
  * {fieldName: value}
 */
var data = {
	name: 'foo bar',
	email: 'foo@bar.com'
}
var isValid = new IsValid(data);
```

Add validation rules

```js
/**
  * to add validation rules use addRule function
  * addRule accepts 3 arguments
  * field Name as in data object
  * friendly Name for error messages
  * rules separated by |
  * rule is specified by a name and optionaly options
  * like for minLength you should also submit what is the minimum length
  * using the brackets way [10]
 **/
isValid.addRule('name', 'Name', 'required|minLength[10]');
```

Run validation rules

```js
/**
  * run function go through all validation rules you specified for all fields
  * it accepts a callback function
  * where err is an array contains all error messages formatted like
  * {fieldName: errorMessage }
  * or null if no errors have been found
  * and data is the data object
 **/
isValid.run(function(err, data){

});
```

## Validation functions

**required**: validates that a value exists

**minLength[l]**: validates that a value length is at minimum equal to l

**maxLength[l]**: validates that a value length is at maximum equal to l

**exactLength[l]**: validates that a value length is exactly l

**greaterThan[l]**: validate that a value is greater than l

**lessThan[l]**: validates that a value is less than l

**alpha**: validates that a value contains only alphabet letters [A-Za-z]

**alphaNumeric**: validates that a value contains only alphabet letters or numbers [A-Za-z0-9]

**alphaNumericDash**: validates that a value contains only alphabet letters, numbers or dash [A-Za-z0-9\-]

**numeric**: validates that a value is numeric [0-9]

**integer**: validates that a value is an integer

**decimal**: validates that a value is a decimal number

**natural**: validates that a value is a natural number >= 0

**naturalNoZero**: validates that a value is a natural number and greater than zero

**email**: validates that a value looks like an email

**regex[s]**: validates that a value matches the given regular expressions s

**matches[f]**: validates that a value matches a value of another field f

**list**: validates that a value is a list

**minListLength[l]**: validates that a list has a minimum length l

**maxListLength[l]**: validates that a list doesn't exceed a maximum length l

**sanitize**: sanitize a value against any possible xss attacks
