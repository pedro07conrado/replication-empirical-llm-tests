let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.log', function(done) {
    const c1 = new pkg.Complex(2, 0);
    const expected1 = new pkg.Complex(Math.log(2), 0);
    assert.strictEqual(c1.log(), expected1);

    const c2 = new pkg.Complex(0, 3);
    const expected2 = new pkg.Complex(Math.log(3), Math.PI / 2);
    assert.strictEqual(c2.log(), expected2);

    const c3 = new pkg.Complex(-4, -5);
    const expected3 = new pkg.Complex(Math.log(29), -Math.atan2(5, 4));
    assert.strictEqual(c3.log(), expected3);

    const c4 = new pkg.Complex(0, 0);
    const expected4 = new pkg.Complex(-Infinity, Math.PI / 2);
    assert.strictEqual(c4.log(), expected4);

    done();
  });
});
