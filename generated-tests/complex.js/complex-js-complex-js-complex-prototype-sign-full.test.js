let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.sign', function(done) {
    const c1 = new pkg.Complex(3, 4);
    const expectedC1 = new pkg.Complex(0.6, 0.8);

    assert.strictEqual(c1.sign().re, expectedC1.re, 'Real part of the sign is incorrect');
    assert.strictEqual(c1.sign().im, expectedC1.im, 'Imaginary part of the sign is incorrect');

    const c2 = new pkg.Complex(-3, -4);
    const expectedC2 = new pkg.Complex(0.6, 0.8);

    assert.strictEqual(c2.sign().re, expectedC2.re, 'Real part of the sign is incorrect');
    assert.strictEqual(c2.sign().im, expectedC2.im, 'Imaginary part of the sign is incorrect');

    done();
  });
});
