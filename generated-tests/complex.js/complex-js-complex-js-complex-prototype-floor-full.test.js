let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.floor', function(done) {
    let c1 = new pkg.Complex(3.75, -2.25);
    let result1 = c1.floor();
    assert.strictEqual(result1.re, 4);
    assert.strictEqual(result1.im, -2);

    let c2 = new pkg.Complex(-0.99, 0.01);
    let result2 = c2.floor();
    assert.strictEqual(result2.re, 0);
    assert.strictEqual(result2.im, 0);

    let c3 = new pkg.Complex(0, 0);
    let result3 = c3.floor();
    assert.strictEqual(result3.re, 0);
    assert.strictEqual(result3.im, 0);

    done();
  });
});
