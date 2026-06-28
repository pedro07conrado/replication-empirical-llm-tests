let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.modeSorted', function(done) {
    // Test case with a single element array
    assert.strictEqual(pkg.modeSorted([5]), 5);

    // Test case with multiple elements, no mode
    assert.strictEqual(pkg.modeSorted([1, 2, 3, 4]), undefined);

    // Test case with an even number of identical elements
    assert.strictEqual(pkg.modeSorted([1, 1, 2, 2]), 1);

    // Test case with a single mode
    assert.strictEqual(pkg.modeSorted([1, 2, 2, 3, 4]), 2);

    // Test case with multiple modes (should return the first one)
    assert.strictEqual(pkg.modeSorted([1, 2, 2, 3, 3, 4]), 2);

    done();
  });
});
