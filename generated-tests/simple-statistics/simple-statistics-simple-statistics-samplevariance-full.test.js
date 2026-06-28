let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.sampleVariance', function(done) {
    // Test with a simple dataset
    let data = [1, 2, 3, 4];
    assert.strictEqual(pkg.sampleVariance(data), 1.25);

    // Test with an empty array
    try {
      pkg.sampleVariance([]);
      assert.fail("Expected an error for an empty array");
    } catch (e) {
      assert.strictEqual(e.message, "sampleVariance requires at least two data points");
    }

    // Test with a single element array
    try {
      pkg.sampleVariance([5]);
      assert.fail("Expected an error for a single-element array");
    } catch (e) {
      assert.strictEqual(e.message, "sampleVariance requires at least two data points");
    }

    // Test with a dataset that includes negative numbers
    let negData = [-1, -2, -3, -4];
    assert.strictEqual(pkg.sampleVariance(negData), 1.25);

    done();
  });
});
