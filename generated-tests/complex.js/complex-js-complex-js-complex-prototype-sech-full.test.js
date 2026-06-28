let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.sech', function(done) {
    const c1 = new Complex(0, 0);
    const expectedC1 = new Complex(2 / Math.E, 0);

    assert.strictEqual(c1.sech(), expectedC1);

    const c2 = new Complex(Math.PI / 4, Math.PI / 4);
    const expectedC2 = new Complex(1 / Math.sqrt(2), 1 / Math.sqrt(2));

    assert.strictEqual(c2.sech(), expectedC2);

    done();
  });
});
