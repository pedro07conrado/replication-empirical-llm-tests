let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.chunk', function(done) {
    // Test with an empty array
    let result1 = pkg.chunk([], 2);
    assert.deepEqual(result1, []);

    // Test with a single element array
    let result2 = pkg.chunk([5], 2);
    assert.deepEqual(result2, [[5]]);

    // Test with multiple elements and chunk size of 1
    let result3 = pkg.chunk([1, 2, 3, 4, 5], 1);
    assert.deepEqual(result3, [[1], [2], [3], [4], [5]]);

    // Test with multiple elements and chunk size of 2
    let result4 = pkg.chunk([1, 2, 3, 4, 5], 2);
    assert.deepEqual(result4, [[1, 2], [3, 4], [5]]);

    // Test with a negative chunk size
    try {
      pkg.chunk([1, 2, 3], -1);
      assert.fail("Expected an error for negative chunk size");
    } catch (e) {
      assert.strictEqual(e.message, "chunk size must be a positive number");
    }

    done();
  });
});
