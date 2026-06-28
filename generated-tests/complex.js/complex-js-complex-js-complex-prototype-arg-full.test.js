let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.arg', function(done) {
    let c1 = new pkg.Complex(0, 1);
    let argC1 = c1.arg();
    assert.strictEqual(argC1, Math.PI / 2);

    let c2 = new pkg.Complex(-1, 0);
    let argC2 = c2.arg();
    assert.strictEqual(argC2, -Math.PI / 2);

    let c3 = new pkg.Complex(1, 1);
    let argC3 = c3.arg();
    assert.strictEqual(argC3, Math.PI / 4);

    let c4 = new pkg.Complex(-1, -1);
    let argC4 = c4.arg();
    assert.strictEqual(argC4, -3 * Math.PI / 4);

    done();
  });
});
