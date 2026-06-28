let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.approxEqual', function(done) {
    // Test case: actual and expected are equal within tolerance
    assert.strictEqual(pkg.approxEqual(1.0, 1.0, 0.001), true);

    // Test case: actual is slightly less than expected within tolerance
    assert.strictEqual(pkg.approxEqual(0.999, 1.0, 0.001), true);

    // Test case: actual is slightly more than expected within tolerance
    assert.strictEqual(pkg.approxEqual(1.01, 1.0, 0.001), true);

    // Test case: actual and expected are not equal but close enough to be considered equal within tolerance
    assert.strictEqual(pkg.approxEqual(1.005, 1.0, 0.004), true);

    // Test case: actual and expected are not equal and not close enough to be considered equal within tolerance
    assert.strictEqual(pkg.approxEqual(1.006, 1.0, 0.004), false);

    done();
  });
});
