let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.quantileRankSorted', function(done) {
    // Test case 1: Value is less than the first element
    assert.strictEqual(pkg.quantileRankSorted([5, 7, 9], 3), 0);

    // Test case 2: Value is greater than the last element
    assert.strictEqual(pkg.quantileRankSorted([5, 7, 9], 10), 1);

    // Test case 3: Value is equal to the first element
    assert.strictEqual(pkg.quantileRankSorted([5, 7, 9], 5), 0.25);

    // Test case 4: Value is equal to the last element
    assert.strictEqual(pkg.quantileRankSorted([5, 7, 9], 9), 0.75);

    // Test case 5: Value exists only once in the array
    assert.strictEqual(pkg.quantileRankSorted([1, 2, 3, 4, 5], 3), 0.6);

    // Test case 6: Value is between two elements
    assert.strictEqual(pkg.quantileRankSorted([1, 2, 3, 4, 5], 2.5), 0.5);

    done();
  });
});
