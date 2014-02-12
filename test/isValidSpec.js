var expect = require('chai').expect;
var IsValid = require('../lib/isValid');
var xss = require('xss');

describe('is.valid', function(){

	beforeEach(function(){
		data = {
			name: 'Bahaa Galal',
			username: 'bahaagalal',
			email: 'bahaa.g.ali@gmail.com',
			password: '12345678',
			confirmPassword: '1234556',
			age: 'dtr456',
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

});