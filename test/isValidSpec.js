var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;
var IsValid = require('../lib/isValid');
var xss = require('xss');

describe('is.valid', function(){

	beforeEach(function(){
		data = {
			name: 'Bahaa Galal',
			confirmName: 'Bahaa',
			username: 'bahaagalal',
			email: 'bahaa.g.ali@gmail.com',
			password: '12345678',
			confirmPassword: '1234556',
			age: 'dtr456',
			code: '<script>alert("hi");</script>'
		};
		isValid = new IsValid(data);
	});

	describe('#constructor', function(){

		it('should init the data property with the data passed', function(){
			expect(isValid.data).to.equal(data);
		});

		it('should load the error messages file if no error messages object has passed', function(){
			expect(isValid.errorMessages).to.exist;
		});

		it('should replace the error messages if an error message object has been passed', function(){
			var errors = {
				lorem: 'lorem ipsum.'
			};
			var isValid2 = new IsValid(data, errors);
			expect(isValid2.errorMessages).to.equal(errors);
		});

	});

	describe('fns', function(){

		describe('#required', function(){

			it('should return true if the value is not undefined, null, NaN, empty string, and zero', function(done){
				isValid.required('foo', null, function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value is undefined, null, NaN, empty string or zero (number)', function(done){
				isValid.required(null, null, function(retrn){
					expect(retrn).to.be.false;
				});

				isValid.required(undefined, null, function(retrn){
					expect(retrn).to.be.false;
				});

				isValid.required(NaN, null, function(retrn){
					expect(retrn).to.be.false;
				});

				isValid.required('', null, function(retrn){
					expect(retrn).to.be.false;
				});

				isValid.required('0', null, function(retrn){
					expect(retrn).to.be.true;
				});

				isValid.required(0, null, function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#minLength', function(){

			it('should return true if the value.length is greater or equalto minLength', function(done){
				isValid.minLength('foo', [3], function(retrn){
					expect(retrn).to.be.true;
				});

				isValid.minLength('foo', [2], function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value.length is less than minLength', function(done){
				isValid.minLength('foo', [4], function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#maxLength', function(){

			it('should return true if the value.length is less or equalto maxLength', function(done){
				isValid.maxLength('foo', [3], function(retrn){
					expect(retrn).to.be.true;
				});

				isValid.maxLength('foo', [4], function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value.length is greater than maxLength', function(done){
				isValid.maxLength('foo', [2], function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#exactLength', function(){

			it('should return true if the value.length is equalto exactLength', function(done){
				isValid.exactLength('foo', [3], function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value.length is greater or less than maxLength', function(done){
				isValid.exactLength('foo', [4], function(retrn){
					expect(retrn).to.be.false;
				});

				isValid.exactLength('foo', [2], function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#greaterThan', function(){

			it('should return true if the value is greater than given value', function(done){
				isValid.greaterThan(12, [9], function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value is less than or equal given value', function(done){
				isValid.greaterThan(12, [12], function(retrn){
					expect(retrn).to.be.false;
				});

				isValid.greaterThan(12, [13], function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#lessThan', function(){

			it('should return true if the value is less than given value', function(done){
				isValid.lessThan(8, [9], function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value is greater than or equal to given value', function(done){
				isValid.lessThan(8, [7], function(retrn){
					expect(retrn).to.be.false;
				});

				isValid.lessThan(8, [8], function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#alpha', function(){

			it('should return true if the value contains only alphabet characters', function(done){
				isValid.alpha('Foobar', null, function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value contains any character outside the alphabet', function(done){
				isValid.alpha('foobar!', null, function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#alphaNumeric', function(){

			it('should return true if the value contains only alphabet characters and/or numbers', function(done){
				isValid.alphaNumeric('Foobar12', null, function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value contains any character outside the alphabet or numbers', function(done){
				isValid.alphaNumeric('foobar12#', null, function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#alphaNumericDash', function(){

			it('should return true if the value contains only alphabet characters, numbers and/or dash(-)', function(done){
				isValid.alphaNumericDash('Foobar12-', null, function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value contains any character outside the alphabet, numbers or dash(-)', function(done){
				isValid.alphaNumericDash('foobar12-_', null, function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#numeric', function(){

			it('should return true if the value contains only numbers', function(done){
				isValid.numeric('12', null, function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value contains any character outside the numbers', function(done){
				isValid.numeric('12d-_', null, function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#integer', function(){

			it('should return true if the value is integer', function(done){
				isValid.integer('12', null, function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value is non integer', function(done){
				isValid.integer('12d-_', null, function(retrn){
					expect(retrn).to.be.false;
				});

				isValid.integer('12.2', null, function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#decimal', function(){

			it('should return true if the value is decimal', function(done){
				isValid.decimal('12', null, function(retrn){
					expect(retrn).to.be.true;
				});

				isValid.decimal('12.12', null, function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value is non decimal', function(done){
				isValid.decimal('12d-_', null, function(retrn){
					expect(retrn).to.be.false;
				});

				isValid.decimal('12.12.1', null, function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#natural', function(){

			it('should return true if the value is natural', function(done){
				isValid.natural('12', null, function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value is non natural', function(done){
				isValid.natural('12d-_', null, function(retrn){
					expect(retrn).to.be.false;
				});

				isValid.natural('-12', null, function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#naturalNoZero', function(){

			it('should return true if the value is natural and not zero', function(done){
				isValid.naturalNoZero('12', null, function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value is non natural or zero', function(done){
				isValid.naturalNoZero('12d-_', null, function(retrn){
					expect(retrn).to.be.false;
				});

				isValid.naturalNoZero('-12', null, function(retrn){
					expect(retrn).to.be.false;
				});

				isValid.naturalNoZero('0', null, function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#email', function(){

			it('should return true if the value looks like an email', function(done){
				isValid.email('foo@bar.ca', null, function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value doesn\'t look like an email', function(done){
				isValid.email('12d-_', null, function(retrn){
					expect(retrn).to.be.false;
				});

				isValid.email('foo@bar', null, function(retrn){
					expect(retrn).to.be.false;
				});

				isValid.email('foo@bar.', null, function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});

		});

		describe('#regex', function(){
			it('should return true if the value matches a given pattern', function(done){
				isValid.regex('19', ['[0-9]+'], function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value doesn\'t match a given pattern', function(done){
				isValid.regex('12d-_', ['^[0-9]+$'], function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});
		});

		describe('#matches', function(){
			it('should return true if the value matches a given value', function(done){
				isValid.matches('19', ['19'], function(retrn){
					expect(retrn).to.be.true;
					done();
				});
			});

			it('should return false if the value doesn\'t match a given value', function(done){
				isValid.matches('12d-_', ['12d-'], function(retrn){
					expect(retrn).to.be.false;
					done();
				});
			});
		});

		describe('#sanitize', function(){
			it('should sanitize the value preventing any xss attack', function(){
				var value = '<script></script>bahaa_500@hotmail.com';
				var sanitizedValue = xss(value);
				expect(isValid.sanitize(value)).to.be.equal(sanitizedValue);
			});
		});

	});

	describe('#validationLogic', function(){

		it('should add an object to fields object with fieldName and parsed Rules', function(){
			isValid.addRule('name', 'Name', 'required|maxLength[10]|matches[confirmName]|regex[A-Za-z\|]');

			expect(isValid.fields).to.have.property('name');
			expect(isValid.fields['name']['fieldName']).to.be.equal('name');
			expect(isValid.fields['name']['friendlyName']).to.be.equal('Name');
			expect(isValid.fields['name']['rules']).to.be.an('array');
			expect(isValid.fields['name']['rules']).to.have.length(4);
			expect(isValid.fields['name']['rules']).to.include.something.that.deep.equals({ruleName: 'required', options: []});
			expect(isValid.fields['name']['rules']).to.include.something.that.deep.equals({ruleName: 'maxLength', options: ['10']});
			expect(isValid.fields['name']['rules']).to.include.something.that.deep.equals({ruleName: 'matches', options: ['Bahaa']});
			expect(isValid.fields['name']['rules']).to.include.something.that.deep.equals({ruleName: 'regex', options: ['A-Za-z\|']});
		});

		it('should throw an error if rule doesn\'t exist', function(){
			var fn = function(){
				isValid.addRule('name', 'Name', 'foobar');
			};
			expect(fn).to.throw(/rule doesn't exist./);
		});

		it('should throw an error if options array is required to perform the validation operation', function(){
			var fn = function(){
				isValid.addRule('name', 'Name', 'matches');
			};
			expect(fn).to.throw(/matches can't operate without options./);
		});

		it('should throw an error if invalid regex is supplied', function(){
			var fn = function(){
				isValid.addRule('name', 'Name', 'regex[\[]');
			};
			expect(fn).to.throw(/regex expression is invalid./);
		});

		it('should sanitize the value in the data array when sanitize is passed as a rule', function(){
			isValid.addRule('code', 'Code', 'sanitize');
			expect(isValid.data['code']).to.be.equal(xss(data['code']));
		});

	});

	describe('#validationExecution', function(){

		it('should return null if no validation rules to test', function(done){
			isValid.addRule('code', 'Code', 'sanitize');
			isValid.addRule('email', 'email', 'sanitize');
			isValid.run(function(err, data){
				expect(err).to.be.null;
				done();
			});
		});

		it('should return the following errors when run', function(done){
			isValid.addRule('name', 'Name', 'minLength[100]|maxLength[2]');
			isValid.run(function(err, data){
				expect(err).to.have.property('name');
				expect(err['name']).to.be.a('string');
				expect(err['name']).to.be.equal('Name field must a have a minimum length of 100.<br>Name field mustn\'t exceed a maximum length of 2.');
				done();
			});
		});
	});

	describe('#list', function(){

		it('should return false if the value provided isn\'t list in its format', function(done){
			var validate = new IsValid({
				keywords: 'apple,,mac'
			});

			validate.addRule('keywords', 'keywords', 'required|list');
			validate.run(function(err, data){
				expect(err).to.not.be.null;
				expect(err).to.be.an('object');
				expect(err).to.have.property('keywords');
				expect(err.keywords).to.be.equal('keywords isn\'t a valid list.');
				done();
			});
		});

		it('should return true if the value provided is a list', function(done){
			var validate = new IsValid({
				keywords: 'apple,mac,iphone'
			});

			validate.addRule('keywords', 'keywords', 'required|list');
			validate.run(function(err, data){
				expect(err).to.be.null;
				done();
			});
		});
	});

	describe('#minListLength', function(){

		it('should return false if the list length is less than 2', function(done){
			var validate = new IsValid({
				keywords: 'apple'
			});

			validate.addRule('keywords', 'keywords', 'required|minListLength[2]');
			validate.run(function(err, data){
				expect(err).to.not.be.null;
				expect(err).to.be.an('object');
				expect(err).to.have.property('keywords');
				expect(err.keywords).to.be.equal('keywords should have a minimum length of 2.');
				done();
			});
		});

		it('should return true if list has the minimum length', function(done){
			var validate = new IsValid({
				keywords: 'apple,mac'
			});

			validate.addRule('keywords', 'keywords', 'required|minListLength[2]');
			validate.run(function(err, data){
				expect(err).to.be.null;
				done();
			});
		});
	});

	describe('#maxListLength', function(){

		it('should return false if the list length is greater than 2', function(done){
			var validate = new IsValid({
				keywords: 'apple,mac,iphone'
			});

			validate.addRule('keywords', 'keywords', 'required|maxListLength[2]');
			validate.run(function(err, data){
				expect(err).to.not.be.null;
				expect(err).to.be.an('object');
				expect(err).to.have.property('keywords');
				expect(err.keywords).to.be.equal('keywords should have a maximum length of 2.');
				done();
			});
		});

		it('should return true if list has below the maximum length', function(done){
			var validate = new IsValid({
				keywords: 'apple,mac'
			});

			validate.addRule('keywords', 'keywords', 'required|maxListLength[2]');
			validate.run(function(err, data){
				expect(err).to.be.null;
				done();
			});
		});
	});

	describe('#date', function(){

		it('should return false if the date isn\'t valid', function(done){
			var validate = new IsValid({
				date: 'invalid-date'
			});

			validate.addRule('date', 'date', 'required|date');
			validate.run(function(err, data){
				expect(err).to.not.be.null;
				expect(err).to.be.an('object');
				expect(err).to.have.property('date');
				expect(err.date).to.be.equal('date should be in a good date shape.');
				done();
			});
		});

		it('should return true if date is valid', function(done){
			var validate = new IsValid({
				date: '2014-01-10'
			});

			validate.addRule('date', 'date', 'required|date');
			validate.run(function(err, data){
				expect(err).to.be.null;
				done();
			});
		});
	});

	describe('#beforeDate', function(){

		it('should return false if the date is after given date', function(done){
			var validate = new IsValid({
				date: '2014-01-10'
			});

			validate.addRule('date', 'date', 'required|date|beforeDate[2014-01-09]');
			validate.run(function(err, data){
				expect(err).to.not.be.null;
				expect(err).to.be.an('object');
				expect(err).to.have.property('date');
				expect(err.date).to.be.equal('date should be earlier than 2014-01-09.');
				done();
			});
		});

		it('should return true if date is before the given date', function(done){
			var validate = new IsValid({
				date: '2014-01-10'
			});

			validate.addRule('date', 'date', 'required|date|beforeDate[2014-01-11]');
			validate.run(function(err, data){
				expect(err).to.be.null;
				done();
			});
		});
	});

});
