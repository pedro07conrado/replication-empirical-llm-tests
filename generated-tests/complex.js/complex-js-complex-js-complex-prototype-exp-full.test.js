let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.exp', function(done) {
    const c1 = new Complex(0, 0);
    const expectedC1 = new Complex(Math.E, 0);
    assert.strictEqual(c1.exp().toString(), expectedC1.toString());

    const c2 = new Complex(1, 0);
    const expectedC2 = new Complex(Math.E, 0);
    assert.strictEqual(c2.exp().toString(), expectedC2.toString());

    const c3 = new Complex(0, Math.PI / 2);
    const expectedC3 = new Complex(0, Math.E);
    assert.strictEqual(c3.exp().toString(), expectedC3.toString());

    const c4 = new Complex(1, Math.PI / 2);
    const expectedC4 = new Complex(0, -Math.E);
    assert.strictEqual(c4.exp().toString(), expectedC4.toString());

    done();
  });
});
