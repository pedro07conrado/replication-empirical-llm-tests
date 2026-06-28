let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.default', function(done) {
    // Test with valid real and imaginary parts
    let c1 = new Complex(3, 4);
    assert.strictEqual(c1.re, 3);
    assert.strictEqual(c1.im, 4);

    // Test with negative values
    let c2 = new Complex(-5, -6);
    assert.strictEqual(c2.re, -5);
    assert.strictEqual(c2.im, -6);

    // Test with zero real and imaginary parts
    let c3 = new Complex(0, 0);
    assert.strictEqual(c3.re, 0);
    assert.strictEqual(c3.im, 0);

    // Test with positive real part and negative imaginary part
    let c4 = new Complex(7, -8);
    assert.strictEqual(c4.re, 7);
    assert.strictEqual(c4.im, -8);

    done();
  });
});
