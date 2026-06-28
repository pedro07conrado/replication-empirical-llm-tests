let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.combinationsReplacement', function(done) {
    // Test case: combinations of length 1 from an array of numbers
    let result1 = pkg.combinationsReplacement([1, 2, 3], 1);
    assert.deepEqual(result1, [[1], [2], [3]], 'Expected combinations of length 1');

    // Test case: combinations of length 2 from an array of numbers
    let result2 = pkg.combinationsReplacement([1, 2, 3], 2);
    assert.deepEqual(result2, [
      [1, 2],
      [1, 3],
      [2, 3]
    ], 'Expected combinations of length 2');

    // Test case: combinations of length 3 from an array of numbers
    let result3 = pkg.combinationsReplacement([1, 2, 3], 3);
    assert.deepEqual(result3, [
      [1, 2, 3]
    ], 'Expected combinations of length 3');

    // Test case: combinations of length 0 (empty set) from an array
    let result4 = pkg.combinationsReplacement([1, 2, 3], 0);
    assert.deepEqual(result4, [[]], 'Expected empty set');

    // Test case: combinations of length 1 from an empty array
    let result5 = pkg.combinationsReplacement([], 1);
    assert.deepEqual(result5, [], 'Expected empty set for empty input');

    done();
  });
});
