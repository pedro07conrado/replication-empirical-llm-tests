let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.coth', function(done) {
    const c1 = new pkg.Complex(0, 0);
    const expected1 = new pkg.Complex(Infinity, 0);

    assert.strictEqual(c1.coth(), expected1);

    const c2 = new pkg.Complex(Math.PI / 4, Math.PI / 4);
    const expected2 = new pkg.Complex(1.5673894687119285, 1.5673894687119285);

    assert.strictEqual(c2.coth(), expected2);

    done();
  });
});
