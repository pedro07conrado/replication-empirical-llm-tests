let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.csch', function(done) {
    const c = new pkg.Complex(1, 0);
    const expected = new pkg.Complex(-2 / Math.sinh(2), 0);

    assert.strictEqual(c.csch(), expected);

    done();
  });
});
