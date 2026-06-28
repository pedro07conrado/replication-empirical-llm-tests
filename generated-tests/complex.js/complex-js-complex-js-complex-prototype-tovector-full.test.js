let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.toVector', function(done) {
    let c = new pkg.Complex(3, 4);
    let result = c.toVector();
    assert.deepEqual(result, [3, 4], 'toVector should return the real and imaginary parts as a vector');
    done();
  });
});
