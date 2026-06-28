let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.sumSimple', function(done) {
    // Test with an array of numbers
    let result1 = pkg.sumSimple([1, 2, 3, 4, 5]);
    assert.strictEqual(result1, 15);

    // Test with an empty array
    let result2 = pkg.sumSimple([]);
    assert.strictEqual(result2, 0);

    // Test with a single number
    let result3 = pkg.sumSimple([7]);
    assert.strictEqual(result3, 7);

    // Test with negative numbers
    let result4 = pkg.sumSimple([-1, -2, -3]);
    assert.strictEqual(result4, -6);

    // Test with mixed types (should return NaN)
    let result5 = pkg.sumSimple([1, 'a', 3]);
    assert.isNaN(result5);

    done();
  });
});
