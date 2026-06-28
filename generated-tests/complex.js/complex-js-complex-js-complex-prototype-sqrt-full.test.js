let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.sqrt', function(done) {
    const c1 = new pkg.Complex(4, 0);
    const expected1 = new pkg.Complex(2, 0);
    assert.strictEqual(c1.sqrt().toString(), expected1.toString());

    const c2 = new pkg.Complex(-9, 0);
    const expected2 = new pkg.Complex(3, 0);
    assert.strictEqual(c2.sqrt().toString(), expected2.toString());

    const c3 = new pkg.Complex(4, 4);
    const expected3 = new pkg.Complex(2 * Math.sqrt(2), 2 * Math.sqrt(2));
    assert.strictEqual(c3.sqrt().toString(), expected3.toString());

    const c4 = new pkg.Complex(-16, -8);
    const expected4 = new pkg.Complex(-4 * Math.sqrt(2), 4 * Math.sqrt(2));
    assert.strictEqual(c4.sqrt().toString(), expected4.toString());

    done();
  });
});
