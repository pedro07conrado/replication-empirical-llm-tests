let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.quantileRank', function(done) {
    // Test case with a single element array
    let x1 = [5];
    let value1 = 5;
    assert.strictEqual(pkg.quantileRank(x1, value1), 0.5);

    // Test case with multiple elements array
    let x2 = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
    let value2 = 3;
    assert.strictEqual(pkg.quantileRank(x2, value2), 0.3);

    // Test case with a single element array and value outside the range
    let x3 = [10];
    let value3 = 15;
    assert.strictEqual(pkg.quantileRank(x3, value3), 1);

    // Test case with an empty array
    let x4 = [];
    let value4 = 5;
    assert.strictEqual(pkg.quantileRank(x4, value4), null);

    // Test case with a single element array and value equal to the minimum
    let x5 = [2];
    let value5 = 2;
    assert.strictEqual(pkg.quantileRank(x5, value5), 0.5);

    done();
  });
});
