let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.abs', function(done) {
    let c1 = new pkg.Complex(3, 4);
    let expected1 = Math.sqrt(3 * 3 + 4 * 4);

    assert.strictEqual(c1.abs(), expected1, 'The absolute value of (3+4i) should be 5');

    let c2 = new pkg.Complex(-1, -1);
    let expected2 = Math.sqrt((-1) * (-1) + (-1) * (-1));

    assert.strictEqual(c2.abs(), expected2, 'The absolute value of (-1-1i) should be sqrt(2)');

    let c3 = new pkg.Complex(0, 5);
    let expected3 = 5;

    assert.strictEqual(c3.abs(), expected3, 'The absolute value of (0+5i) should be 5');

    let c4 = new pkg.Complex(7, 0);
    let expected4 = 7;

    assert.strictEqual(c4.abs(), expected4, 'The absolute value of (7+0i) should be 7');

    done();
  });
});
