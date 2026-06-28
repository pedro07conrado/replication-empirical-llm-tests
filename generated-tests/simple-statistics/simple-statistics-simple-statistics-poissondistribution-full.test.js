let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.poissonDistribution', function(done) {
    // Test with a lambda value that results in a distribution with multiple values
    let result = pkg.poissonDistribution(3);
    assert.isArray(result, 'The result should be an array');
    assert.strictEqual(result.length, 10, 'The length of the result should be 10');

    // Test with a lambda value that results in a single value distribution
    result = pkg.poissonDistribution(0);
    assert.isArray(result, 'The result should be an array');
    assert.strictEqual(result.length, 1, 'The length of the result should be 1');

    // Test with a lambda value that is very small and results in a single value distribution
    result = pkg.poissonDistribution(0.0001);
    assert.isArray(result, 'The result should be an array');
    assert.strictEqual(result.length, 1, 'The length of the result should be 1');

    // Test with a lambda value that is very large and results in a distribution with multiple values
    result = pkg.poissonDistribution(20);
    assert.isArray(result, 'The result should be an array');
    assert.strictEqual(result.length, 10, 'The length of the result should be 10');

    // Test with a lambda value that is exactly zero and results in an empty array
    result = pkg.poissonDistribution(0);
    assert.isArray(result, 'The result should be an array');
    assert.strictEqual(result.length, 0, 'The length of the result should be 0');

    done();
  });
});
