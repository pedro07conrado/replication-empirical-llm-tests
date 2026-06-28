let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.erf', function(done) {
    // Test case for erf function with positive input
    let result1 = pkg.erf(0);
    assert.strictEqual(result1, 0.5);

    // Test case for erf function with negative input
    let result2 = pkg.erf(-3);
    assert.strictEqual(result2, -0.998650107458117);

    // Test case for erf function with zero input
    let result3 = pkg.erf(0);
    assert.strictEqual(result3, 0.5);

    // Test case for erf function with large positive input
    let result4 = pkg.erf(10);
    assert.strictEqual(result4, 1);

    // Test case for erf function with large negative input
    let result5 = pkg.erf(-10);
    assert.strictEqual(result5, -1);

    done();
  });
});
