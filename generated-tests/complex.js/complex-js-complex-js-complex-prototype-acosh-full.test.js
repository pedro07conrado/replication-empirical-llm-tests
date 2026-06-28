let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.acosh', function(done) {
    // Test case 1: a > 1
    const z1 = new Complex(2, 0);
    assert.strictEqual(z1.acosh().toString(), '3.095574860402484');

    // Test case 2: -1 < a <= 1
    const z2 = new Complex(-0.5, 0);
    assert.strictEqual(z2.acosh().toString(), '1.5707963267948966i');

    // Test case 3: a < -1
    const z3 = new Complex(-2, 0);
    assert.strictEqual(z3.acosh().toString(), '-3.095574860402484 + 3.141592653589793i');

    // Test case 4: a = 1
    const z4 = new Complex(1, 0);
    assert.strictEqual(z4.acosh().toString(), '0');

    // Test case 5: a = -1
    const z5 = new Complex(-1, 0);
    assert.strictEqual(z5.acosh().toString(), '3.141592653589793i');

    done();
  });
});
