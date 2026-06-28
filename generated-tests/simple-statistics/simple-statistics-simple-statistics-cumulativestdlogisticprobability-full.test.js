let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.cumulativeStdLogisticProbability', function(done) {
    // Test case: x = 0
    assert.strictEqual(pkg.cumulativeStdLogisticProbability(0), 0.5);

    // Test case: x = 1
    assert.strictEqual(pkg.cumulativeStdLogisticProbability(1), 0.8413447460685429);

    // Test case: x = -1
    assert.strictEqual(pkg.cumulativeStdLogisticProbability(-1), 0.1586552539314571);

    // Test case: x = 2
    assert.strictEqual(pkg.cumulativeStdLogisticProbability(2), 0.9772498680519354);

    // Test case: x = -2
    assert.strictEqual(pkg.cumulativeStdLogisticProbability(-2), 0.02275013194806457);

    done();
  });
});
