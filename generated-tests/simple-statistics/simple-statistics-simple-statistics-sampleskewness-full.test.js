let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.sampleSkewness', function(done) {
    // Test with a simple dataset
    let data = [1, 2, 3];
    let skewness = pkg.sampleSkewness(data);
    assert.strictEqual(skewness, 0);

    // Test with a skewed dataset
    data = [1, 1, 1, 4, 5];
    skewness = pkg.sampleSkewness(data);
    assert.ok(Math.abs(skewness - 2.36) < 0.01);

    // Test with an even number of elements
    data = [1, 2, 3, 4];
    skewness = pkg.sampleSkewness(data);
    assert.strictEqual(skewness, 0);

    // Test with a dataset containing only one element
    data = [5];
    try {
      pkg.sampleSkewness(data);
      assert.fail("Expected an error for single-element dataset");
    } catch (e) {
      assert.strictEqual(e.message, "sampleSkewness requires at least three data points");
    }

    done();
  });
});
