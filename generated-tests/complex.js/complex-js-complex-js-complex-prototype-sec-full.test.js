let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.sec', function(done) {
    const c1 = new Complex(0, 0);
    const expected1 = new Complex(1, 0);

    const c2 = new Complex(Math.PI / 4, Math.PI / 4);
    const expected2 = new Complex(1 / Math.sqrt(2), 1 / Math.sqrt(2));

    assert.strictEqual(c1.sec().toString(), expected1.toString());
    assert.strictEqual(c2.sec().toString(), expected2.toString());

    done();
  });
});
