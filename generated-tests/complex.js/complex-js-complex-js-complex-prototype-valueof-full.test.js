let mocha = require('mocha');
let assert = require('assert');
let pkg = require('complex.js');

describe('test complex.js', function() {
  it('test complex.js.Complex.prototype.valueOf', function(done) {
    let c1 = new pkg.Complex(3, 0);
    let c2 = new pkg.Complex(0, 4);

    assert.strictEqual(c1.valueOf(), 3);
    assert.strictEqual(c2.valueOf(), null);

    done();
  });
});
