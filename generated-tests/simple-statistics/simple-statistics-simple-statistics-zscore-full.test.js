let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.zScore', function(done) {
    // Test case with known input and expected output
    let x = 10;
    let mean = 5;
    let standardDeviation = 2;
    let expectedOutput = (x - mean) / standardDeviation;

    assert.strictEqual(pkg.zScore(x, mean, standardDeviation), expectedOutput);

    // Test case with edge value
    x = 0;
    mean = 0;
    standardDeviation = 1;
    expectedOutput = 0;

    assert.strictEqual(pkg.zScore(x, mean, standardDeviation), expectedOutput);

    // Test case with zero standard deviation
    try {
      pkg.zScore(x, mean, 0);
    } catch (e) {
      assert.strictEqual(e.message, 'Standard deviation cannot be zero');
    }

    done();
  });
});
