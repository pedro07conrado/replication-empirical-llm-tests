let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.conjugate', function(done) {
    let c1 = new pkg.Complex(3, 4);
    let conjugateC1 = c1.conjugate();
    assert.strictEqual(conjugateC1.re, 3);
    assert.strictEqual(conjugateC1.im, -4);

    let c2 = new pkg.Complex(-1, 0);
    let conjugateC2 = c2.conjugate();
    assert.strictEqual(conjugateC2.re, -1);
    assert.strictEqual(conjugateC2.im, 0);

    let c3 = new pkg.Complex(0, 5);
    let conjugateC3 = c3.conjugate();
    assert.strictEqual(conjugateC3.re, 0);
    assert.strictEqual(conjugateC3.im, -5);

    done();
  });
});
