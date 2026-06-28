let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.tanh', function(done) {
    const c = new pkg.Complex(0, 1);
    const expected = new pkg.Complex(-0.7615941559557649, 0.6480532460810565);

    assert.strictEqual(c.tanh().re, expected.re, 'Real part of tanh(1i) is incorrect');
    assert.strictEqual(c.tanh().im, expected.im, 'Imaginary part of tanh(1i) is incorrect');

    done();
  });
});
