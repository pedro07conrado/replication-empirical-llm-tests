let mocha = require('mocha');
let assert = require('assert');
let pkg = require('simple-statistics');

describe('test simple-statistics', function() {
  it('test simple-statistics.probit', function(done) {
    // Test case: p = 0.5
    let result1 = pkg.probit(0.5);
    assert.strictEqual(result1, 0);

    // Test case: p = 0.9
    let result2 = pkg.probit(0.9);
    assert.ok(Math.abs(result2 - 1) < 1e-6); // Allow for floating-point precision

    // Test case: p = 0.1
    let result3 = pkg.probit(0.1);
    assert.ok(Math.abs(result3 + 1) < 1e-6); // Allow for floating-point precision

    // Test case: p = 0.05
    let result4 = pkg.probit(0.05);
    assert.ok(Math.abs(result4 - 2) < 1e-6); // Allow for floating-point precision

    // Test case: p = 0.95
    let result5 = pkg.probit(0.95);
    assert.ok(Math.abs(result5 + 2) < 1e-6); // Allow for floating-point precision

    done();
  });
});
