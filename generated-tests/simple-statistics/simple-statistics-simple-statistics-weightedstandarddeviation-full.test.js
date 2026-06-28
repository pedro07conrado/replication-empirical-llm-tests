let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.weightedStandardDeviation', function(done) {
    // Test case with known input and expected output
    let x = [1, 2, 3];
    let weights = [0.5, 0.3, 0.2];
    let expected = Math.sqrt(0.5 * (1 - 2)^2 + 0.3 * (2 - 2)^2 + 0.2 * (3 - 2)^2);
    assert.strictEqual(pkg.weightedStandardDeviation(x, weights), expected);

    // Test case with all weights equal
    x = [1, 2, 3];
    weights = [1, 1, 1];
    expected = Math.sqrt((1/3) * (1 - 2)^2 + (1/3) * (2 - 2)^2 + (1/3) * (3 - 2)^2);
    assert.strictEqual(pkg.weightedStandardDeviation(x, weights), expected);

    // Test case with all weights zero
    x = [1, 2, 3];
    weights = [0, 0, 0];
    assert.strictEqual(pkg.weightedStandardDeviation(x, weights), NaN);

    // Test case with one weight zero
    x = [1, 2, 3];
    weights = [1, 0, 1];
    expected = Math.sqrt((1/2) * (1 - 2)^2 + (1/2) * (3 - 2)^2);
    assert.strictEqual(pkg.weightedStandardDeviation(x, weights), expected);

    // Test case with negative numbers
    x = [-1, -2, -3];
    weights = [0.5, 0.3, 0.2];
    expected = Math.sqrt(0.5 * (-1 + 2)^2 + 0.3 * (-2 + 2)^2 + 0.2 * (-3 + 2)^2);
    assert.strictEqual(pkg.weightedStandardDeviation(x, weights), expected);

    done();
  });
});
