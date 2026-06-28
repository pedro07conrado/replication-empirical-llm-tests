let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.mul', function(done) {
    const a = new Complex(2, 3);
    const b = new Complex(4, 5);

    const result = a.mul(b);

    assert.strictEqual(result.re, -7);
    assert.strictEqual(result.im, 22);

    done();
  });
});
