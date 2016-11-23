var main = require('../main');
var should = require('should');

describe('now test -> main.js', function() {
    it('should equal to 0 when n === 0', function() {
        main.fibonacci(0).should.equal(0);
    })
    it('should equal to 55 when n === 10', function() {
        main.fibonacci(10).should.equal(55);
    })
    it('should more than 55 when n === 11', function() {
        main.fibonacci(11).should.above(55);
    })
    it('should equal to 145 when n === 12', function() {
        main.fibonacci(12).should.equal(145);
    })
    it('should throw when n < 0', function(){
        (function() {
            main.fibonacci(-1);
        }).should.throw('Invalid n!');
    })
    it('should throw when n is NaN', function(){
        (function() {
            main.fibonacci('测试');
        }).should.throw('Invalid n!');
    })
})
