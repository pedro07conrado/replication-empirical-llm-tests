let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.isZero', function(done) {
    let c1 = new pkg.Complex(0, 0);
    let c2 = new pkg.Complex(1, 0);
    let c3 = new pkg.Complex(0, 1);

    assert.strictEqual(c1.isZero(), true);
    assert.strictEqual(c2.isZero(), false);
    assert.strictEqual(c3.isZero(), false);

    done();
  });
});
