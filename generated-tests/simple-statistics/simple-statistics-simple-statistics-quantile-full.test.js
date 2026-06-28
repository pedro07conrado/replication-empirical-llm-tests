let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.quantile', function(done) {
    // Test case: single quantile for a sorted array
    var x = [1, 2, 3, 4, 5];
    var p = 0.5;
    assert.strictEqual(pkg.quantile(x, p), 3);

    // Test case: multiple quantiles for a sorted array
    var x = [1, 2, 3, 4, 5];
    var p = [0.25, 0.5, 0.75];
    assert.deepEqual(pkg.quantile(x, p), [2, 3, 4]);

    // Test case: single quantile for an unsorted array
    var x = [5, 1, 3, 4, 2];
    var p = 0.5;
    assert.strictEqual(pkg.quantile(x, p), 3);

    // Test case: multiple quantiles for an unsorted array
    var x = [5, 1, 3, 4, 2];
    var p = [0.25, 0.5, 0.75];
    assert.deepEqual(pkg.quantile(x, p), [2, 3, 4]);

    // Test case: single quantile for an array with a single element
    var x = [1];
    var p = 0;
    assert.strictEqual(pkg.quantile(x, p), 1);

    done();
  });
});
