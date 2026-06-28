let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.binomialDistribution', function(done) {
    // Test with valid input parameters
    let result1 = pkg.binomialDistribution(5, 0.5);
    assert.deepEqual(result1, [32, 80, 80, 32, 1], 'Test with n=5 and p=0.5');

    // Test with edge case where trials is 1
    let result2 = pkg.binomialDistribution(1, 0.5);
    assert.deepEqual(result2, [1, 1], 'Test with n=1 and p=0.5');

    // Test with probability outside the valid range
    let result3 = pkg.binomialDistribution(5, -0.1);
    assert.strictEqual(result3, undefined, 'Test with invalid probability (-0.1)');

    // Test with non-integer trials
    let result4 = pkg.binomialDistribution(2.5, 0.5);
    assert.strictEqual(result4, undefined, 'Test with non-integer trials (2.5)');

    done();
  });
});
