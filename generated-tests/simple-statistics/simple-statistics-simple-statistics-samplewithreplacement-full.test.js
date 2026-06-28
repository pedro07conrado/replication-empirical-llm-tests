let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.sampleWithReplacement', function(done) {
    let x = [1, 2, 3, 4, 5];
    let n = 3;
    let randomSource = Math.random;

    let result = pkg.sampleWithReplacement(x, n, randomSource);

    assert.ok(result.length === n);
    assert.ok(result.every(num => num >= 1 && num <= 5));
    assert.ok(new Set(result).size === n); // Ensure all elements are unique

    done();
  });
});
