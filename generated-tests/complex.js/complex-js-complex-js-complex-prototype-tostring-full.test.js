let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.toString', function(done) {
    let c1 = new pkg.Complex(3, 4);
    assert.strictEqual(c1.toString(), '3+4i');

    let c2 = new pkg.Complex(-5, -6);
    assert.strictEqual(c2.toString(), '-5-6i');

    let c3 = new pkg.Complex(0, 7);
    assert.strictEqual(c3.toString(), '7i');

    let c4 = new pkg.Complex(8, 0);
    assert.strictEqual(c4.toString(), '8');

    let c5 = new pkg.Complex(0, 0);
    assert.strictEqual(c5.toString(), '0');

    done();
  });
});
