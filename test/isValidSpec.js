"user strict";
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const Validator = require('../lib/isValid');
const checkedRules = require('../lib/checkedRules');
// var xss = require('xss');

describe('is.valid6', function(){

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
		isValid = new Validator(data);
	});

	describe('#constructor', function(){

		it('should init the data property with the data passed', function(){
			expect(isValid.data).to.equal(data);
		});
	});


	describe('#validationLogic', function(){

		it('should add an object to fields object with fieldName and parsed Rules', function(){
			isValid.addRule('name', 'required|maxLength[10]|matches[confirmName]');

			expect(isValid.ruledFields).to.have.property('name');
			expect(isValid.ruledFields['name']).to.be.an('array');
			expect(isValid.ruledFields['name']).to.have.length(3);
			expect(isValid.ruledFields['name']).to.include.something.that.deep.equals({ruleName: 'required', options: []});
			expect(isValid.ruledFields['name']).to.include.something.that.deep.equals({ruleName: 'maxLength', options: ['10']});
			expect(isValid.ruledFields['name']).to.include.something.that.deep.equals({ruleName: 'matches', options: ['Bahaa']});
		});

		it('should throw an error if rule doesn\'t exist', function(){
			var fn = function(){
				isValid.addRule('name', 'foobar');
			};
			expect(fn).to.throw(/rule doesn't exist./);
		});

		it('should throw an error if options array is required to perform the validation operation', function(){
			var fn = function(){
				isValid.addRule('name', 'matches');
			};
			expect(fn).to.throw(/matches can't operate without options./);
		});

		it('should throw an error if invalid regex is supplied', function(){
			var fn = function(){
				isValid.addRule('name', 'regex[\[]');
			};
			expect(fn).to.throw(/regex expression is invalid./);
		});

		// it('should sanitize the value in the data array when sanitize is passed as a rule', function(){
		// 	isValid.addRule('code', 'Code', 'sanitize');
		// 	expect(isValid.data['code']).to.be.equal(xss(data['code']));
		// });

	});

	describe('#validationExecution', function(){

		it('should return null if no validation rules to test', function(){
			// isValid.addRule('code', 'Code', 'sanitize');
			// isValid.addRule('email', 'email', 'sanitize');
			return isValid.run().then(value => {
				expect(value).to.be.equal(isValid.data);
			});
		});

		it('should return minLength and maxLength errors when run', function(){
			isValid.addRule('name', 'minLength[100]|maxLength[2]');
			var p = isValid.run().catch(err => {
				expect(err).to.have.property('name');
				expect(err['name']).to.be.an('array');
				expect(err['name']).to.have.length(2);
				expect(err['name']).to.include.something.that.deep.equals({type: 'minLength', meta: ['100']});
				expect(err['name']).to.include.something.that.deep.equals({type: 'maxLength', meta:   ['2']});
			});
			return p;
		});
	});

	describe('#list', function(){

		it('should return false if the value provided isn\'t list in its format', function(){
			var validate = new Validator({
				keywords: 'apple,,mac'
			});

			validate.addRule('keywords', 'required|list');
			var p = validate.run().catch(err => {
				expect(err).to.not.be.null;
				expect(err).to.have.property('keywords');
				expect(err['keywords']).to.be.an('array');
				expect(err['keywords']).to.have.length(1);
				expect(err['keywords']).to.include.something.that.deep.equals({type: 'list', meta: []});
			});
			return p;
		});

		it('should return true if the value provided is a list', function(){
			var validate = new Validator({
				keywords: 'apple,mac,iphone'
			});

			validate.addRule('keywords', 'required|list');
			return validate.run().then(val => {
				expect(val).to.be.equal(validate.data);
			});
		});

	});

	describe('#minListLength', function(){

		it('should return false if the list length is less than 2', function(){
			var validate = new Validator({
				keywords: 'apple,,'
			});

			validate.addRule('keywords', 'required|list|minListLength[2]');
			return validate.run().catch(err => {
				expect(err).to.not.be.null;
				expect(err).to.have.property('keywords');
				expect(err['keywords']).to.be.an('array');
				expect(err['keywords']).to.have.length(2);
				expect(err['keywords']).to.include.something.that.deep.equals({type: 'minListLength', meta: ['2']});
				expect(err['keywords']).to.include.something.that.deep.equals({type: 'list', meta: []});
			});

		});

		it('should return true if list has the minimum length', function(){
			var validate = new Validator({
				keywords: 'apple,mac'
			});

			validate.addRule('keywords', 'required|minListLength[2]');
			return validate.run().then(val => {
				expect(val).to.be.equal(validate.data);
			});
		});
	});

	describe('#maxListLength', function(){

		it('should return false if the list length is greater than 2', function(){
			var validate = new Validator({
				keywords: 'apple,mac,iphone'
			});

			validate.addRule('keywords', 'required|maxListLength[2]');
			return validate.run().catch(err => {
				expect(err).to.not.be.null;
				expect(err).to.have.property('keywords');
				expect(err['keywords']).to.be.an('array');
				expect(err['keywords']).to.have.length(1);
				expect(err['keywords']).to.include.something.that.deep.equals({type: 'maxListLength', meta: ['2']});
			});
		});

		it('should return true if list has below the maximum length', function(){
			var validate = new Validator({
				keywords: 'apple,mac'
			});

			validate.addRule('keywords', 'required|maxListLength[2]');
			return validate.run().then(val => {
				expect(val).to.be.equal(validate.data);
			});
		});
	});

	describe('#date', function(){

		it('should return false if the date isn\'t valid', function(){
			var validate = new Validator({
				date: 'invalid-date'
			});

			validate.addRule('date', 'required|date');
			return validate.run().catch(err => {
				expect(err).to.not.be.null;
				expect(err).to.have.property('date');
				expect(err['date']).to.be.an('array');
				expect(err['date']).to.have.length(1);
				expect(err['date']).to.include.something.that.deep.equals({type: 'date', meta: []});
			});
		});

		it('should return true if date is valid', function(){
			var validate = new Validator({
				date: '2014-01-10'
			});

			validate.addRule('date', 'required|date');
			return validate.run().then(val => {
				expect(val).to.be.equal(validate.data);
			});
		});
	});

	describe('#beforeDate', function(){

		it('should return false if the date is after given date', function(){
			var validate = new Validator({
				date: '2014-01-10'
			});

			validate.addRule('date', 'required|date|beforeDate[2014-01-09]');
			return validate.run().catch(err => {
				expect(err).to.not.be.null;
				expect(err).to.have.property('date');
				expect(err['date']).to.be.an('array');
				expect(err['date']).to.have.length(1);
				expect(err['date']).to.include.something.that.deep.equals({type: 'beforeDate', meta: ['2014-01-09']});
			});
		});

		it('should return true if date is before the given date', function(){
			var validate = new Validator({
				date: '2014-01-10'
			});

			validate.addRule('date', 'date', 'required|date|beforeDate[2014-01-11]');
			return validate.run().then(val => {
				expect(val).to.be.equal(validate.data);
			});
		});
	});

	describe('#afterDate', function(){

		it('should return false if the date is before given date', function(){
			var validate = new Validator({
				date: '2014-01-10'
			});

			validate.addRule('date', 'required|date|afterDate[2014-01-11]');
			return validate.run().catch(err => {
				expect(err).to.not.be.null;
				expect(err).to.have.property('date');
				expect(err['date']).to.be.an('array');
				expect(err['date']).to.have.length(1);
				expect(err['date']).to.include.something.that.deep.equals({type: 'afterDate', meta: ['2014-01-11']});
			});
		});

		it('should return true if date is after the given date', function(){
			var validate = new Validator({
				date: '2014-01-10'
			});

			validate.addRule('date', 'required|date|afterDate[2014-01-09]');
			return validate.run().then(val => {
				expect(val).to.be.equal(validate.data);
			});
		});
	});

	describe('#boolean', function(){

		it('should return false if the value is not true or false', function(){
			var validate = new Validator({
				is_active: 'no'
			});

			validate.addRule('is_active', 'required|boolean');
			return validate.run().catch(err => {
				expect(err).to.not.be.null;
				expect(err).to.have.property('is_active');
				expect(err['is_active']).to.be.an('array');
				expect(err['is_active']).to.have.length(1);
				expect(err['is_active']).to.include.something.that.deep.equals({type: 'boolean', meta: []});
			});
		});

		it('should return true if value is true or false', function(){
			var validate = new Validator({
				is_active: 'true',
				is_not_active: 'false'
			});

			validate.addRule('is_active', 'required|boolean');
			validate.addRule('is_not_active', 'required|boolean');
			return validate.run().then(val => {
				expect(val).to.be.equal(validate.data);
			});
		});
	});

});
