let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.acot', function(done) {
    const c1 = new Complex(0, 1);
    const expected1 = new Complex(Math.atan2(1, 0), 0);

    assert.strictEqual(c1.acot(), expected1, 'Test case 1 failed');

    const c2 = new Complex(1, 1);
    const expected2 = new Complex(-Math.PI / 4, Math.PI / 4);

    assert.strictEqual(c2.acot(), expected2, 'Test case 2 failed');

    const c3 = new Complex(0, -1);
    const expected3 = new Complex(Math.atan2(-1, 0), 0);

    assert.strictEqual(c3.acot(), expected3, 'Test case 3 failed');

    const c4 = new Complex(1, -1);
    const expected4 = new Complex(Math.PI / 4, -Math.PI / 4);

    assert.strictEqual(c4.acot(), expected4, 'Test case 4 failed');

    done();
  });
});
