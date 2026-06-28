let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.weightedVariance', function(done) {
    // Test case with known input and expected output
    let x = [1, 2, 3];
    let weights = [0.5, 0.3, 0.2];
    let expectedOutput = (0.5 * (1 - 2)**2 + 0.3 * (2 - 2)**2 + 0.2 * (3 - 2)**2) / (0.5 + 0.3 + 0.2);
    assert.strictEqual(pkg.weightedVariance(x, weights), expectedOutput);

    // Test case with all weights equal
    x = [1, 2, 3];
    weights = [1, 1, 1];
    expectedOutput = (1 * (1 - 2)**2 + 1 * (2 - 2)**2 + 1 * (3 - 2)**2) / (1 + 1 + 1);
    assert.strictEqual(pkg.weightedVariance(x, weights), expectedOutput);

    // Test case with all values equal
    x = [4, 4, 4];
    weights = [0.5, 0.3, 0.2];
    expectedOutput = (0.5 * (4 - 4)**2 + 0.3 * (4 - 4)**2 + 0.2 * (4 - 4)**2) / (0.5 + 0.3 + 0.2);
    assert.strictEqual(pkg.weightedVariance(x, weights), expectedOutput);

    // Test case with negative values
    x = [-1, 0, 1];
    weights = [0.5, 0.3, 0.2];
    expectedOutput = (0.5 * (-1 - 0)**2 + 0.3 * (0 - 0)**2 + 0.2 * (1 - 0)**2) / (0.5 + 0.3 + 0.2);
    assert.strictEqual(pkg.weightedVariance(x, weights), expectedOutput);

    // Test case with zero weights
    x = [1, 2, 3];
    weights = [0, 0, 0];
    try {
      pkg.weightedVariance(x, weights);
      assert.fail('Expected an error for zero weights');
    } catch (e) {
      assert.strictEqual(e.message, 'Weights must be non-zero and sum to a positive number.');
    }

    done();
  });
});
