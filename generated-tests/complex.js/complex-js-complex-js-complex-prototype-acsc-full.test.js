let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.acsc', function(done) {
    const c1 = new Complex(0, 0);
    const expected1 = new Complex(Math.PI / 2, Infinity);
    assert.strictEqual(c1.acsc().toString(), expected1.toString());

    const c2 = new Complex(1, 0);
    const expected2 = new Complex(0, Math.PI / 4);
    assert.strictEqual(c2.acsc().toString(), expected2.toString());

    const c3 = new Complex(0, 1);
    const expected3 = new Complex(Math.PI / 2, -Math.PI / 4);
    assert.strictEqual(c3.acsc().toString(), expected3.toString());

    const c4 = new Complex(-1, 0);
    const expected4 = new Complex(Math.PI, Math.PI / 4);
    assert.strictEqual(c4.acsc().toString(), expected4.toString());

    done();
  });
});
