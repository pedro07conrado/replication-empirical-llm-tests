let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.atan', function(done) {
    const c1 = new Complex(0, 1);
    const expected1 = new Complex(0, Infinity);
    assert.strictEqual(c1.atan(), expected1);

    const c2 = new Complex(0, -1);
    const expected2 = new Complex(0, -Infinity);
    assert.strictEqual(c2.atan(), expected2);

    const c3 = new Complex(1, 0);
    const expected3 = new Complex(0.5 * Math.PI, 0);
    assert.strictEqual(c3.atan(), expected3);

    const c4 = new Complex(-1, 0);
    const expected4 = new Complex(-0.5 * Math.PI, 0);
    assert.strictEqual(c4.atan(), expected4);

    const c5 = new Complex(2, 2);
    const expected5 = new Complex(Math.atan(1), 0);
    assert.strictEqual(c5.atan().toFixed(6), expected5.toFixed(6));

    done();
  });
});
