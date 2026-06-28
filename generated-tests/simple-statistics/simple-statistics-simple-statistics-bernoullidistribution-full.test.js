let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.bernoulliDistribution', function(done) {
    // Test with a valid probability
    let result1 = pkg.bernoulliDistribution(0.5);
    assert.deepEqual(result1, [0.5, 0.5], 'Expected [0.5, 0.5] for p=0.5');

    // Test with the minimum probability
    let result2 = pkg.bernoulliDistribution(0);
    assert.deepEqual(result2, [1, 0], 'Expected [1, 0] for p=0');

    // Test with the maximum probability
    let result3 = pkg.bernoulliDistribution(1);
    assert.deepEqual(result3, [0, 1], 'Expected [0, 1] for p=1');

    // Test with a non-numeric input
    try {
      pkg.bernoulliDistribution('a');
      assert.fail('Expected an error for non-numeric input');
    } catch (e) {
      assert.strictEqual(e.message, "bernoulliDistribution requires probability to be between 0 and 1 inclusive");
    }

    // Test with a negative probability
    try {
      pkg.bernoulliDistribution(-0.5);
      assert.fail('Expected an error for negative probability');
    } catch (e) {
      assert.strictEqual(e.message, "bernoulliDistribution requires probability to be between 0 and 1 inclusive");
    }

    // Test with a probability greater than 1
    try {
      pkg.bernoulliDistribution(1.5);
      assert.fail('Expected an error for probability greater than 1');
    } catch (e) {
      assert.strictEqual(e.message, "bernoulliDistribution requires probability to be between 0 and 1 inclusive");
    }

    done();
  });
});
