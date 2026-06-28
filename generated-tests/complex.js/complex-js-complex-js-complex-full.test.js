let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex', function(done) {
    const c1 = new pkg.Complex(3, 4);
    assert.strictEqual(c1.re, 3);
    assert.strictEqual(c1.im, 4);

    const c2 = new pkg.Complex(-1, -2);
    assert.strictEqual(c2.re, -1);
    assert.strictEqual(c2.im, -2);

    const c3 = new pkg.Complex(0, 5);
    assert.strictEqual(c3.re, 0);
    assert.strictEqual(c3.im, 5);

    const c4 = new pkg.Complex(-3, 0);
    assert.strictEqual(c4.re, -3);
    assert.strictEqual(c4.im, 0);

    done();
  });
});
