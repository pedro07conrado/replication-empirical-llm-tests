let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.weightedQuantile', function(done) {
    // Test case: Basic weighted quantile calculation
    var x = [1, 2, 3];
    var weights = [0.5, 0.3, 0.2];
    var p = 0.5;
    assert.strictEqual(pkg.weightedQuantile(x, weights, p), 2);

    // Test case: Multiple weighted quantiles
    var x = [1, 2, 3];
    var weights = [0.5, 0.3, 0.2];
    var p = [0.25, 0.75];
    assert.deepEqual(pkg.weightedQuantile(x, weights, p), [1, 3]);

    // Test case: Edge case with all weights equal
    var x = [1, 2, 3];
    var weights = [1, 1, 1];
    var p = 0.5;
    assert.strictEqual(pkg.weightedQuantile(x, weights, p), 2);

    // Test case: Single element array
    var x = [42];
    var weights = [1];
    var p = 0.5;
    assert.strictEqual(pkg.weightedQuantile(x, weights, p), 42);

    // Test case: Empty arrays
    var x = [];
    var weights = [];
    var p = 0.5;
    assert.strictEqual(pkg.weightedQuantile(x, weights, p), null);

    done();
  });
});
