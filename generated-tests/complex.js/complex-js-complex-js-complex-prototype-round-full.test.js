let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.round', function(done) {
    let c1 = new pkg.Complex(3.14159, 2.71828);
    assert.strictEqual(c1.round().toString(), '3.14 + 2.72i');

    let c2 = new pkg.Complex(-0.61803, -1.61803);
    assert.strictEqual(c2.round(2).toString(), '-0.62 - 1.62i');

    let c3 = new pkg.Complex(0.5, 0.5);
    assert.strictEqual(c3.round().toString(), '1 + 1i');

    let c4 = new pkg.Complex(-0.99999, 0.99999);
    assert.strictEqual(c4.round(2).toString(), '-1 + 1i');

    done();
  });
});
