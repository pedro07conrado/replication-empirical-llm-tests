let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.logit', function(done) {
    // Test with a value within the valid range
    let result1 = pkg.logit(0.5);
    assert.strictEqual(result1, 0);

    // Test with a value at the lower bound (exclusive)
    try {
      pkg.logit(0);
      assert.fail('Expected an error for p <= 0');
    } catch (e) {
      assert.strictEqual(e.message, 'p must be strictly between zero and one');
    }

    // Test with a value at the upper bound (exclusive)
    try {
      pkg.logit(1);
      assert.fail('Expected an error for p >= 1');
    } catch (e) {
      assert.strictEqual(e.message, 'p must be strictly between zero and one');
    }

    // Test with a valid value
    let result2 = pkg.logit(0.75);
    assert.strictEqual(result2, Math.log(0.75 / 0.25));

    done();
  });
});
