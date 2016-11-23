var main = require('../main');
var should = require('should');

describe('now test -> main.js', function() {
    it('should equal to 55 when n === 10', function() {
        main.fibonacci(10).should.equal(55);
    })
    it('should more than 55 when n === 11', function() {
        main.fibonacci(11).should.above(55);
    })
    it('should equal to 145 when n === 12', function() {
        main.fibonacci(12).should.equal(145);
    })
})
