let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.uniqueCountSorted', function(done) {
    // Test case with an empty array
    assert.strictEqual(pkg.uniqueCountSorted([]), 0);

    // Test case with a single element array
    assert.strictEqual(pkg.uniqueCountSorted([1]), 1);

    // Test case with multiple unique elements
    assert.strictEqual(pkg.uniqueCountSorted([1, 2, 3, 4, 5]), 5);

    // Test case with duplicate elements
    assert.strictEqual(pkg.uniqueCountSorted([1, 2, 2, 3, 4, 4, 5]), 5);

    // Test case with negative numbers
    assert.strictEqual(pkg.uniqueCountSorted([-1, -2, -3, -4, -5]), 5);

    // Test case with mixed positive and negative numbers
    assert.strictEqual(pkg.uniqueCountSorted([1, -2, 3, -4, 5, -6]), 6);

    done();
  });
});
