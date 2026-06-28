let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.ceil', function(done) {
    let c1 = new pkg.Complex(3.7, 2.5);
    let result1 = c1.ceil();
    assert.strictEqual(result1.re, 4);
    assert.strictEqual(result1.im, 3);

    let c2 = new pkg.Complex(-3.7, -2.5);
    let result2 = c2.ceil();
    assert.strictEqual(result2.re, -3);
    assert.strictEqual(result2.im, -2);

    let c3 = new pkg.Complex(0.1, 0.9);
    let result3 = c3.ceil();
    assert.strictEqual(result3.re, 1);
    assert.strictEqual(result3.im, 1);

    let c4 = new pkg.Complex(-0.1, -0.9);
    let result4 = c4.ceil();
    assert.strictEqual(result4.re, 0);
    assert.strictEqual(result4.im, 0);

    done();
  });
});
