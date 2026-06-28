let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.clone', function(done) {
    let originalComplex = new pkg.Complex(1, 2);
    let clonedComplex = originalComplex.clone();

    assert.strictEqual(clonedComplex.re, originalComplex.re, 'Real part should be the same');
    assert.strictEqual(clonedComplex.im, originalComplex.im, 'Imaginary part should be the same');

    done();
  });
});
