let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.asinh', function(done) {
    const z1 = new Complex(0, 0);
    assert.strictEqual(z1.asinh().toString(), '0+0i');

    const z2 = new Complex(1, 0);
    assert.strictEqual(z2.asinh().toString(), '0.8414709848078965+0i');

    const z3 = new Complex(-1, 0);
    assert.strictEqual(z3.asinh().toString(), '-0.8414709848078965+0i');

    const z4 = new Complex(0, 1);
    assert.strictEqual(z4.asinh().toString(), '0.5493061443340281+1.5707963267948966i');

    const z5 = new Complex(-1, 1);
    assert.strictEqual(z5.asinh().toString(), '-0.5493061443340281+1.5707963267948966i');

    done();
  });
});
