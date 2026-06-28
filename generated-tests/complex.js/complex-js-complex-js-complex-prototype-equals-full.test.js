let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.equals', function(done) {
    const z1 = new pkg.Complex(1, 2);
    const z2 = new pkg.Complex(1.0000000000000001, 2);
    const z3 = new pkg.Complex(1, 2.0000000000000001);

    assert.strictEqual(z1.equals(z2), true);
    assert.strictEqual(z1.equals(z3), true);
    assert.strictEqual(z1.equals(new pkg.Complex(1, 2)), true);
    assert.strictEqual(z1.equals(new pkg.Complex(2, 1)), false);
    assert.strictEqual(z1.equals(new pkg.Complex(0, 0)), false);

    done();
  });
});
