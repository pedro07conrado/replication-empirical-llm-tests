let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.isInfinite', function(done) {
    let c1 = new pkg.Complex(Infinity, 0);
    let c2 = new pkg.Complex(0, Infinity);
    let c3 = new pkg.Complex(0, 0);

    assert.strictEqual(c1.isInfinite(), true);
    assert.strictEqual(c2.isInfinite(), true);
    assert.strictEqual(c3.isInfinite(), false);

    done();
  });
});
