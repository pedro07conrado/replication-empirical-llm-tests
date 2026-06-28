let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.sinh', function(done) {
    const c1 = new Complex(0, 0);
    const expected1 = new Complex(0, 0);

    const c2 = new Complex(Math.PI / 4, Math.PI / 4);
    const expected2 = new Complex(Math.sqrt(2), Math.sqrt(2));

    assert.strictEqual(c1.sinh(), expected1);
    assert.strictEqual(c2.sinh(), expected2);

    done();
  });
});
