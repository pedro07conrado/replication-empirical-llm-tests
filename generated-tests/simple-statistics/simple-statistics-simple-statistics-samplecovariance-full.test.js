let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.sampleCovariance', function(done) {
    // Test with two datasets of equal length and positive values
    let x = [1, 2, 3];
    let y = [4, 5, 6];
    assert.strictEqual(pkg.sampleCovariance(x, y), 2.0);

    // Test with two datasets of equal length and negative values
    x = [-1, -2, -3];
    y = [-4, -5, -6];
    assert.strictEqual(pkg.sampleCovariance(x, y), 2.0);

    // Test with two datasets of equal length and mixed positive/negative values
    x = [1, -2, 3];
    y = [-4, 5, -6];
    assert.strictEqual(pkg.sampleCovariance(x, y), 2.0);

    // Test with two datasets of different lengths
    x = [1, 2, 3];
    y = [4, 5];
    assert.throws(() => pkg.sampleCovariance(x, y), Error);

    // Test with one dataset having less than two elements
    x = [1];
    y = [2];
    assert.throws(() => pkg.sampleCovariance(x, y), Error);

    done();
  });
});
