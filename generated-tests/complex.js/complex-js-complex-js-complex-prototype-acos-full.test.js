let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.acos', function(done) {
    const c1 = new pkg.Complex(0, 1);
    const expected1 = new pkg.Complex(Math.PI / 2 - Math.log(2), 0);

    assert.strictEqual(c1.acos().toString(), expected1.toString());

    const c2 = new pkg.Complex(-1, 0);
    const expected2 = new pkg.Complex(Math.PI, 0);

    assert.strictEqual(c2.acos().toString(), expected2.toString());

    done();
  });
});
