var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;
// var xss = require('xss');
const checkedRules = require('../lib/checkedRules');

describe('checkedRules', function(){

	describe('fns', function(){

		describe('#required', function(){

			it('should return true if the value is not undefined, null, NaN, empty string, and zero', function(done){
				expect(checkedRules['required']('foo')).to.be.true;
				done();
			});

			it('should return false if the value is undefined, null, NaN, empty string or zero (number)', function(done){
				expect(checkedRules['required'](null)).to.be.false;
				expect(checkedRules['required'](undefined)).to.be.false;
				expect(checkedRules['required'](NaN)).to.be.false;
				expect(checkedRules['required']('')).to.be.false;
				expect(checkedRules['required']('0')).to.be.true;
				expect(checkedRules['required'](0)).to.be.false;
				done();
			});

		});

		describe('#minLength', function(){

			it('should return true if the value.length is greater or equalto minLength', function(done){
				expect(checkedRules['minLength']('foo', [3])).to.be.true;
				expect(checkedRules['minLength']('foo', [2])).to.be.true;
				done();
			});

			it('should return false if the value.length is less than minLength', function(done){
				expect(checkedRules['minLength']('foo', [4])).to.be.false;
				done();
			});

		});

		describe('#maxLength', function(){

			it('should return true if the value.length is less or equalto maxLength', function(done){
				expect(checkedRules['maxLength']('foo', [3])).to.be.true;
				expect(checkedRules['maxLength']('foo', [4])).to.be.true;
				done();
			});

			it('should return false if the value.length is greater than maxLength', function(done){
				expect(checkedRules['maxLength']('foo', [2])).to.be.false;
				done();
			});

		});

		describe('#exactLength', function(){

			it('should return true if the value.length is equalto exactLength', function(done){
				expect(checkedRules['exactLength']('foo', [3])).to.be.true;
				done();
			});

			it('should return false if the value.length is greater or less than maxLength', function(done){
				expect(checkedRules['exactLength']('foo', [4])).to.be.false;
				expect(checkedRules['exactLength']('foo', [2])).to.be.false;
				done();
			});

		});

		describe('#greaterThan', function(){

			it('should return true if the value is greater than given value', function(done){
				expect(checkedRules['greaterThan'](12, [9])).to.be.true;
				done();
			});

			it('should return false if the value is less than or equal given value', function(done){
				expect(checkedRules['greaterThan'](12, [12])).to.be.false;
				expect(checkedRules['greaterThan'](12, [13])).to.be.false;
				done();
			});

		});

		describe('#lessThan', function(){

			it('should return true if the value is less than given value', function(done){
					expect(checkedRules['lessThan'](8, [9])).to.be.true;
					done();
			});

			it('should return false if the value is greater than or equal to given value', function(done){
				expect(checkedRules['lessThan'](8, [7])).to.be.false;
				expect(checkedRules['lessThan'](8, [7])).to.be.false;
				done();
			});

		});

		describe('#alpha', function() {

			it('should return true if the value contains only alphabet characters', function(done){
				expect(checkedRules['alpha']('Foobar')).to.be.true;
				done();
			});

			it('should return false if the value contains any character outside the alphabet', function(done){
				expect(checkedRules['alpha']('foobar!')).to.be.false;
				done();
			});

		});

		describe('#alphaNumeric', function(){

			it('should return true if the value contains only alphabet characters and/or numbers', function(done){
				expect(checkedRules['alphaNumeric']('Foobar12')).to.be.true;
				done();
			});

			it('should return false if the value contains any character outside the alphabet or numbers', function(done){
				expect(checkedRules['alphaNumeric']('foobar12#')).to.be.false;
				done();
			});

		});

		describe('#alphaNumericDash', function(){

			it('should return true if the value contains only alphabet characters, numbers and/or dash(-)', function(done){
				expect(checkedRules['alphaNumericDash']('foobar12-')).to.be.true;
				done();
			});

			it('should return false if the value contains any character outside the alphabet, numbers or dash(-)', function(done){
				expect(checkedRules['alphaNumericDash']('foobar12-_')).to.be.false;//underscore is an alpha, right?!
				done();
			});

		});

		describe('#numeric', function(){

			it('should return true if the value contains only numbers', function(done){
				expect(checkedRules['numeric']('12')).to.be.true;
				done();
			});

			it('should return false if the value contains any character outside the numbers', function(done){
				expect(checkedRules['numeric']('12d-_')).to.be.false;
				done();
			});

		});

		describe('#integer', function(){

			it('should return true if the value is integer', function(done){
				expect(checkedRules['numeric']('12')).to.be.true;
				done();
			});

			it('should return false if the value is non integer', function(done){
				expect(checkedRules['numeric']('12d-_')).to.be.false;
				expect(checkedRules['numeric']('12.2')).to.be.false;
				done();
			});

		});

		describe('#decimal', function(){

			it('should return true if the value is decimal', function(done){
				expect(checkedRules['decimal']('12')).to.be.true;
				expect(checkedRules['decimal']('12.12')).to.be.true;
				done();
			});

			it('should return false if the value is non decimal', function(done){
				expect(checkedRules['decimal']('12d-_')).to.be.false;
				expect(checkedRules['decimal']('12.12.1')).to.be.false;
				done();
			});

		});

		describe('#natural', function(){

			it('should return true if the value is natural', function(done){
				expect(checkedRules['natural']('12')).to.be.true;
				done();
			});

			it('should return false if the value is non natural', function(done){
				expect(checkedRules['natural']('12d-_')).to.be.false;
				expect(checkedRules['natural']('-12')).to.be.false;
				done();
			});

		});

		describe('#naturalNoZero', function(){

			it('should return true if the value is natural and not zero', function(done){
				expect(checkedRules['naturalNoZero']('12')).to.be.true;
				done();
			});

			it('should return false if the value is non natural or zero', function(done){
				expect(checkedRules['naturalNoZero']('12d-_')).to.be.false;
				expect(checkedRules['naturalNoZero']('-12')).to.be.false;
				expect(checkedRules['naturalNoZero']('0')).to.be.false;
				done();
			});

		});

		describe('#email', function(){

			it('should return true if the value looks like an email', function(done){
				expect(checkedRules['email']('foo@bar.ca')).to.be.true;
				done();
			});

			it('should return false if the value doesn\'t look like an email', function(done){
				expect(checkedRules['email']('12d-_')).to.be.false;
				expect(checkedRules['email']('foo@bar')).to.be.false;
				expect(checkedRules['email']('foo.ca')).to.be.false;
				done();
			});

		});

		describe('#regex', function(){
			it('should return true if the value matches a given pattern', function(done){
				expect(checkedRules['regex']('19',['[0-9]+'])).to.be.true;
				done();
			});

			it('should return false if the value doesn\'t match a given pattern', function(done){
				expect(checkedRules['regex']('12d-_',['^[0-9]+$'])).to.be.false;
				done();
			});
		});

		describe('#matches', function(){
			it('should return true if the value matches a given value', function(done){
				expect(checkedRules['matches']('19', ['19'])).to.be.true;
				done();
			});

			it('should return false if the value doesn\'t match a given value', function(done){
				expect(checkedRules['matches']('19222', ['19'])).to.be.false;
				done();
			});
		});

		describe('#List', function(){

			it('should return true if the value is comma separated vallues', function(done){
				expect(checkedRules['list']('12,13,14')).to.be.true;
				done();
			});

			it('should return false if the value is not comma separated vallues', function(done){
				expect(checkedRules['list']('mac, ,wind')).to.be.false;
				done();
			});

		});

		describe('#Date', function(){

			it('should return true if the value is valid formated date', function(done){
				expect(checkedRules['date']('2014-01-09')).to.be.true;
				done();
			});

			it('should return false if the value is not valid date', function(done){
				expect(checkedRules['date']('mac,,wind')).to.be.false;
				done();
			});

		});

		describe('#afterDate', function(){

			it('should return true if the value is after a given date', function(done){
				expect(checkedRules['afterDate']('2014-01-09', ['2014-01-08'])).to.be.true;
				done();
			});

			it('should return false if the value is not after date parameter', function(done){
				expect(checkedRules['afterDate']('2014-01-09', ['2014-01-09'])).to.be.false;
				expect(checkedRules['afterDate']('2014-01-08', ['2014-01-09'])).to.be.false;
				done();
			});

		});

		// describe('#sanitize', function(){
		// 	it('should sanitize the value preventing any xss attack', function(){
		// 		var value = '<script></script>bahaa_500@hotmail.com';
		// 		var sanitizedValue = xss(value);
		// 		expect(isValid.sanitize(value)).to.be.equal(sanitizedValue);
		// 	});
		// });

	});

});
