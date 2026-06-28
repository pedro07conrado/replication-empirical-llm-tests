let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.product', function(done) {
    // Test with an empty array
    assert.strictEqual(pkg.product([]), 1);

    // Test with a single element
    assert.strictEqual(pkg.product([5]), 5);

    // Test with multiple elements
    assert.strictEqual(pkg.product([2, 3, 4]), 24);

    // Test with negative numbers
    assert.strictEqual(pkg.product([-1, -2, -3]), 6);

    // Test with zero
    assert.strictEqual(pkg.product([0, 5]), 0);

    done();
  });
});
