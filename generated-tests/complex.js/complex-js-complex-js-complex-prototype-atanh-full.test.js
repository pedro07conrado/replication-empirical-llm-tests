let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.atanh', function(done) {
    // Test case: a = 0, b = 0
    let z1 = new Complex(0, 0);
    assert.strictEqual(z1.atanh().toString(), '0+0i');

    // Test case: a = 1, b = 0
    let z2 = new Complex(1, 0);
    assert.strictEqual(z2.atanh().toString(), '+Infinity+0i');

    // Test case: a = -1, b = 0
    let z3 = new Complex(-1, 0);
    assert.strictEqual(z3.atanh().toString(), '-Infinity+0i');

    // Test case: a = 0.5, b = 0
    let z4 = new Complex(0.5, 0);
    assert.strictEqual(z4.atanh().toString(), '0.5708+0i');

    // Test case: a = 2, b = 0
    let z5 = new Complex(2, 0);
    assert.strictEqual(z5.atanh().toString(), '-1.3169+0i');

    done();
  });
});
