let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.geometricMean', function(done) {
    // Test with a single positive number
    assert.strictEqual(pkg.geometricMean([2]), 2);

    // Test with multiple positive numbers
    assert.strictEqual(pkg.geometricMean([1, 2, 3]), Math.pow(6, 1 / 3));

    // Test with zero
    assert.strictEqual(pkg.geometricMean([0, 1, 2]), 0);

    // Test with negative number should throw an error
    try {
      pkg.geometricMean([-1, 2]);
    } catch (e) {
      assert.strictEqual(e.message, "geometricMean requires only non-negative numbers as input");
    }

    // Test with empty array should throw an error
    try {
      pkg.geometricMean([]);
    } catch (e) {
      assert.strictEqual(e.message, "geometricMean requires at least one data point");
    }

    done();
  });
});
