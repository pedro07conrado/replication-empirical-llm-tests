let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.asech', function(done) {
    const z1 = new Complex(0, 0);
    const expected1 = pkg['INFINITY'];
    assert.strictEqual(z1.asech(), expected1);

    const z2 = new Complex(1, 0);
    const expected2 = new Complex(Math.PI / 2);
    assert.strictEqual(z2.asech(), expected2);

    const z3 = new Complex(-1, 0);
    const expected3 = new Complex(3 * Math.PI / 4);
    assert.strictEqual(z3.asech(), expected3);

    const z4 = new Complex(0, 1);
    const expected4 = new Complex(Math.PI / 2);
    assert.strictEqual(z4.asech(), expected4);

    const z5 = new Complex(0, -1);
    const expected5 = new Complex(-Math.PI / 2);
    assert.strictEqual(z5.asech(), expected5);

    done();
  });
});
