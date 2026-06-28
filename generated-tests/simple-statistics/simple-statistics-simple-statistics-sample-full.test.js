let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.sample', function(done) {
    // Test with a simple array and n=2
    let x = [1, 2, 3, 4, 5];
    let n = 2;
    let result = pkg.sample(x, n);
    assert.ok(result.length === n, 'The result should have the same length as n');
    assert.ok(result.every(num => x.includes(num)), 'All elements in the result should be in the original array');

    // Test with an empty array
    let emptyArray = [];
    let emptyResult = pkg.sample(emptyArray, 3);
    assert.strictEqual(emptyResult.length, 0, 'The result for an empty array should be an empty array');

    // Test with a single element array and n=1
    let singleElementArray = [42];
    let singleElementResult = pkg.sample(singleElementArray, 1);
    assert.ok(singleElementResult.includes(42), 'The result should include the single element');

    // Test with an array of numbers and n=0
    let zeroN = 0;
    let zeroNR = pkg.sample(x, zeroN);
    assert.strictEqual(zeroNR.length, 0, 'The result for n=0 should be an empty array');

    // Test with a large array and randomSource
    let largeArray = Array.from({ length: 100 }, (_, i) => i + 1);
    let randomSource = Math.random;
    let largeResult = pkg.sample(largeArray, 50, randomSource);
    assert.ok(largeResult.length === n, 'The result should have the same length as n');
    done();
  });
});
